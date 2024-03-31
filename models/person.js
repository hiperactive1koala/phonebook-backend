const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('Error connecting to MongoDB', error.message);
    });

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },

    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`,
        },
        minLength: 8,
        required: true
    }
})

PersonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', PersonSchema);