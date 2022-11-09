import express  from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();
const server = new http.Server(app);
const io = new Server(server);

interface IIndexable {
    [index: string | number]: string;
}

const USERS: IIndexable = {};

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


io.on("connection", (socket) => {
    console.log("user joined.");
    socket.on("new-user", (name: string) => {
        USERS[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
        console.log(`User ${name} joined.`);
    });

    //TODO: Blow this up to a message object after proof of concept
    socket.on("send-chat-message", (message: string) => {
        socket.broadcast.emit("chat-message", { message, name: USERS[socket.id]});
        console.log(`[${USERS[socket.id]}]:\t${message}`);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", USERS[socket.id]);
        delete USERS[socket.id];
    });
});
