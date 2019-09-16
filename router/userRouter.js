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

    const hash = bcryptjs.hashSync(password, 10)
    userDb.insert({username, password: hash})
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            console.log(err)
          res.status(500).json({ error: "There was an oopsies"});
        });
});

router.post('/login', (req, res) => {
    
});

module.exports = router