const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})




app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const nameExists = persons.some(person => person.name === body.name)

    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 1000000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})



app.get('/info', (request, response) => {
    const count = persons.length
    const time = new Date()

    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
