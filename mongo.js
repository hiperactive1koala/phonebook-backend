const mongoose = require('mongoose');

const url = `mongodb+srv://koala:${process.argv[2]}@node-cluster.abxjazt.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=node-cluster`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', PersonSchema);

if (process.argv[3] !== undefined) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person
    .save()
    .then(() => {
      mongoose.connection.close();
    });
} else {
  Person
    .find({})
    .then((result) => {
      result.forEach(() => {

      });
      mongoose.connection.close();
    });
}
