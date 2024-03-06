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

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express()

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    let person = persons.find(person => id === person.id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let date = new Date()
    response
        .status(200)
        .send(`<p>PhoneBook has info for ${persons.length} people <br /> ${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const randomIdGenerator = () => Math.floor(Math.random() * 1000);

app.post('/api/persons', (request, response) => {
    let body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    let isExist = persons.find(person => person.name === body.name)
    if (isExist) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    let person = {
        id: randomIdGenerator(),
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)