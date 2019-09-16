const express = require('express')
const bcryptjs = require('bcryptjs')

const userDb = require('../helpers/userHelper')
const test = require('../authentication-middleware/authentication')

const router = express.Router()

router.use(express.json());

router.get('/', test.idCheck, (req, res) => {
    userDb.get()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(()=>{
        res.status(500).jason({error: "The projects information could not be retrieved."})
    })     
})

router.post('/register', (req, res) => {
    let { username, password } = req.body
    //its magic
    const hash = bcryptjs.hashSync(password, 10)

    userDb.insert({username, password: hash})
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            console.log(err)
          res.status(500).json({ error: "There was an oopsies"})
        })
});

router.post('/login', (req, res) => {
    let { username, password } = req.body

    userDb.getBy({ username })
    .first()
    .then(user => {
        if (user && bcryptjs.compareSync(password, user.password)){
            res.status(200).json({ message: `Yayyyy you passed the hashtest: ${user.username}`})
        } else {
            res.status(401).status({ message: 'Hah TRY AGAIN'})
        }
    })
    .catch(err => {
        console.log(err)
      res.status(500).json({ error: "There was an oopsies"})
    })
});

module.exports = router