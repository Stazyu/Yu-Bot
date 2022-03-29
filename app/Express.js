const express = require('express');
const http = require('http');
const app = express();

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = server;