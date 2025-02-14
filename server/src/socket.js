import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app.js";
import {
  onConnectionController,
  socketAuthToken,
} from "./controllers/socket.controller.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.use(socketAuthToken);
io.on("connection", onConnectionController);

export { server, io };
