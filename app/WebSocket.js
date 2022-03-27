const { Server } = require('socket.io');
const server = require('./Express');

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

module.exports = io;