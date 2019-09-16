const express = require('express');

const userRouter = require('../router/userRouter');

const server = express();
server.use(express.json());

server.use('/api', userRouter);

server.get('/', (req, res) => {
    res.json({ sanity: 'check'})
});

module.exports = server;