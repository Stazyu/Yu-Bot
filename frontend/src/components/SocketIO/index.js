import { io } from "socket.io-client";
import production from "../../helpers/production";

const url_server = production ? "/" : "http://localhost:5000";

const socket = io(url_server, {
    reconnection: true,
    autoConnect: true,
    secure: true,
    transports: ["websocket"]
});
socket.connect();

export default socket;