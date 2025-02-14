import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Queue from "../utils/Queue.js";
import { Flashcard } from "../models/flashcard.model.js";
import GameRoom from "../utils/GameRoom.js";
import { io } from "../socket.js";
import { combatTotalQuestions } from "../constants.js";

const activeUsers = new Map();
const waitingUsers = new Queue();
const gameRoomIds = new Map();
const gameRooms = new Map();

export const socketAuthToken = async (socket, next) => {
  socket.user = null;
  try {
    const cookies = socket.handshake.headers.cookie
      ?.split("; ")
      .reduce((acc, e) => {
        const [key, value] = e.split("=");
        acc[key] = value;
        return acc;
      }, {});

    const user = await jwt.verify(
      cookies?.accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    socket.user = await User.findById(user?._id).select(
      "-password -refreshToken"
    );
    if (!socket.user) return next(new Error("User Not Found"));
  } catch (e) {
    console.log(e);
  }
  next();
};

export const onConnectionController = (socket) => {
  const user = socket.user;
  if (user) {
    if (activeUsers.has(String(user?.username))) {
      console.log("User already connected");
      socket.disconnect(true);
      socket.data.message = "User already connected";
      return;
    }

    console.log(`User connected: ${user?.username}, ${socket.id}`);
    activeUsers.set(String(user?.username), socket.id);
    console.log(activeUsers);

    socket.on("join", async () => {
      if (!waitingUsers.isEmpty()) {
        const opponentId = waitingUsers.dequeue();
        const gameRoom = new GameRoom(user.username, opponentId);

        //fetch flashcards
        const flashcards = await Flashcard.aggregate([
          {
            $addFields: {
              isEmpty: {
                $cond: {
                  if: { $eq: ["$answer", ""] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $match: {
              isEmpty: false,
            },
          },
          {
            $sample: {
              size: combatTotalQuestions,
            },
          },
          {
            $addFields: {
              content: "$question",
            },
          },
        ]);

        gameRoom.addFlashCards(flashcards);
        gameRoomIds.set(String(user.username), gameRoom.roomId);
        gameRoomIds.set(opponentId, gameRoom.roomId);
        gameRooms.set(gameRoom.roomId, gameRoom);
        console.log(`room created: ${gameRoom.toString()}`);
        
        // send user the data
        io.to(socket.id)
          .to(activeUsers.get(gameRoom.getOpponent(user.username)))
          .emit("join", gameRoom);

      } else {
        console.log(`room added to queue: ${user.username}`);
        waitingUsers.enqueue(String(user.username));
      }
      console.log(`waiting users: `);
      waitingUsers.print();
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`room:${roomId} joined successfully: ${socket.user?.username}`);
    });

    // user sends answer
    socket.on("send-answer", (answer) => {
        const gameRoom = gameRooms.get(gameRoomIds.get(String(user.username)));
        console.log("send-answer initiated", gameRoom.roomId);
        if (gameRoom) {
            gameRoom.submitAnswer(user.username, answer);
            gameRooms.set(gameRoom.roomId, gameRoom);
        }

        // send data to users
        io.to(socket.id)
          .to(activeUsers.get(gameRoom.getOpponent(String(user.username))))
          .emit("recieve-answer", gameRoom);
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user?.username}, ${socket.id}`);
      waitingUsers.delete(String(activeUsers.get(user?.username)));
      activeUsers.delete(String(user?.username));
      console.log(activeUsers);
    });
  }
};
