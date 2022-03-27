const express = require('express');
const http = require('http');
const app = express()
const port = 5000;

const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = server;