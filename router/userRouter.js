const express = require('express')
const bcryptjs = require('bcryptjs')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const userDb = require('../helpers/userHelper')
const { idCheck } = require('../authentication-middleware/authentication')

const dbConnection = require('../data/dbConfig')
const router = express.Router()

const sessionConfig = {
    name: 'chocolate chip',
    secret: process.env.SESSION_SECRET || 'keep it secret, tralala nothing to see here',
    cookie: {
      maxAge: 1000 * 60,
      secure: false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: true, //GDPR compliance
    store: new KnexSessionStore({
      knex: dbConnection,
      createtable: true,
      clearInterval: 1000 * 60 *30
    })
  }

router.use(express.json());
router.use(session(sessionConfig))


router.get('/users', idCheck, (req, res) => {
    userDb.get()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(()=>{
        console.log(err)
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
            req.session.user = user
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

router.get('/logout', (req,res)=> {
    if(req.session) {
        req.session.destroy()
        res.status(200).json('byyebye')
    } else {
        res.status(200).json({message: 'alraedy logged out'})
    }
})

module.exports = router