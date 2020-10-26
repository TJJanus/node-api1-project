const express = require('express')
const generate = require('shortid').generate

const app = express()
app.use(express.json())

const port = 7000

// Fake Data
let users = [
    {
        id: generate(),
        name: 'Jane Doe',
        bio: 'Not Tarzans Wife, another Jane'
    },
]

// testing to see if server is up and running 
app.get('/', (req, res) => { 
    res.send({
        api: 'working'
    })
})

// [GET] all the users
app.get('/api/users', (req, res) => {
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({ message: 'Not found' })
    }
})

// [GET] an individual user by ID

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === id)

    if (!user) {
        res.status(404).json({message: 'The user with specified ID does not exist'})
    } else {
        res.status(200).json(user)
    }
})

// [POST] a new user to the users array

app.post('/api/users', (req, res) => {
    const { name, bio } = req.body

    if (!name || !bio ) {
        res.status(400).json({
            errorMessage: 'Please provide a name and bio for the user'
        })
    } else {
        const newUser = { id: generate(), name, bio }
        users.push(newUser)
        res.status(201).json(newUser)
    }
})

// [PUT] update a user by id
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params

    const { name, bio } = req.body

    const indexOfUser = users.findIndex(user => user.id === id)
try {
    if (indexOfUser !== -1) {
        users[indexOfUser] = { id, name, bio }
        res.status(200).json({id, name, bio})
        
    } else if (!name || !bio ) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    } else {
        res.status(404).json({
            message: 'The user with the specified ID does not exist.'
        })
    }
} catch (error) {
    res.status(500).json({
        errorMessage: 'The user information could not be modified.'
    })
}
})


app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    try {
      if (!users.find(user => user.id === id)) {
        res.status(404).json({ 
          message: "The user with the specified ID does not exist."
        })
      } else {
        users = users.filter(user => user.id !== id)
        res.status(200).json({ message: `user with id ${id} got deleted!`})
      }
    } catch (error) {
      res.status(500).json({
          errorMessage: "The user could not be removed"
      })
    }
  })




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})