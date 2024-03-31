let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express()
const Person = require('./models/person')

morgan.token('body', getBody = (req) => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

app.get('/', (request, response) => {
    response.send('<h1>Hell No</h1>')
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then((result) => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    let date = new Date()
    response.status(200)
        .send(`<p>PhoneBook has info for ${Person.length} people <br /> ${date}</p>`)
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    let body = request.body

    let person = {
        name: body.name,
        number: body.number
    }
    Person.findOneAndUpdate({ name: body.name }, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            if (updatedPerson === null) {
                let newPerson = new Person({
                    "name": body.name,
                    "number": body.number
                })

                newPerson.save()
                    .then(result => {
                        response.json(result);
                    })
            } else {
                response.json(updatedPerson)
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    let body = request.body

    let person = {
        name: body.name,
        number: body.number
    }
    Person.findOneAndUpdate({ name: body.name }, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error);

    if (error.name === 'CastError') {
        return response.status(204).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)