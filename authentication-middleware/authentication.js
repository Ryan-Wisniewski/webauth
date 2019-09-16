const bcrypt = require('bcryptjs')

const usersDb = require('../helpers/userHelper')

module.exports = {
    idCheck,
}

function idCheck (req, res, next) {
    let { username, password } = req.headers
    // console.log(req.headers)
    usersDb.getBy({ username })
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            next()
        } else {
            console.log(user)
            res.status(401).json({ message: 'Invalid credentials'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: 'Oops something happened'});
      });
}