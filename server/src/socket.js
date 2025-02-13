import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

export default server;