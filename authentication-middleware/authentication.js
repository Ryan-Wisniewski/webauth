const bcrypt = require('bcryptjs')

const usersDb = require('../helpers/userHelper')

module.exports = {
    idCheck,
}

function idCheck (req, res, next) {
        // console.log(req.session)
        if( req.session && req.session.user){
            next()
        } else {
            res.status(401).json({ message: 'Invalid credentials'})
        }
}