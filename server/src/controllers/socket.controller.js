import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Queue from "../utils/Queue.js";
import { Flashcard } from "../models/flashcard.model.js";
import GameRoom from "../utils/GameRoom.js";
import { io } from "../socket.js";
import { combatTotalQuestions, combatTotalTime } from "../constants.js";
import { generateMCQ } from "../utils/OpenAI.js";

const activeUsers = new Map();
const waitingUsers = new Queue();
const gameRoomIds = new Map();
const gameRooms = new Map();

const getFlashcard = async () => {
  const rawFlashcards = await Flashcard.aggregate([
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
  ]);
  const questions = JSON.stringify(rawFlashcards.map((e, ind) => e.question));
  // console.log(questions);
  const ans = await generateMCQ(questions);
  // console.log(ans);
  return JSON.parse(ans);
};

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
  if (!user) {
    socket.disconnect(true);
    return io.to(socket.id).emit("error", "User validation error");
  }

  if (activeUsers.has(String(user?.username))) {
    console.log("User already connected");
    socket.disconnect(true);
    socket.data.message = "User already connected";
    return;
  }

  console.log(`User connected: ${user?.username}, ${socket.id}`);
  activeUsers.set(String(user?.username), socket.id);
  console.log(activeUsers);

  socket.on("check-joined", () => {
    const roomId = gameRoomIds.get(String(user?.username));
    console.log("checking if already in a room", gameRoomIds, roomId);
    if (roomId) {
      return io.to(socket.id).emit("already-joined", gameRooms.get(roomId).toObject());
    }
  });

  socket.on("join", async () => {
    if (!waitingUsers.isEmpty()) {
      const opponentId = waitingUsers.dequeue();
      const gameRoom = new GameRoom(user.username, opponentId);

      //fetch flashcards
      const flashcards = await getFlashcard();
      console.log("from join- ",flashcards);
      gameRoom.addFlashCards(flashcards);
      gameRoomIds.set(String(user.username), gameRoom.roomId);
      gameRoomIds.set(opponentId, gameRoom.roomId);
      gameRooms.set(gameRoom.roomId, gameRoom);
      console.log(`room created: ${gameRoom.toString()}`);

      setTimeout(() => {
        if (gameRoomIds.has(String(user.username))) {
          console.log("game finished", gameRoom.roomId);
          gameRoom.setWinner();
          gameRoomIds.delete(String(user.username));
          gameRoomIds.delete(opponentId);
          gameRooms.delete(gameRoom.roomId);
          io.to(socket.id)
            .to(activeUsers.get(gameRoom.getOpponent(String(user.username))))
            .emit("game-result", gameRoom);
        }
      }, combatTotalTime * 1000);

      // send user the data
      io.to(socket.id)
        .to(activeUsers.get(gameRoom.getOpponent(user.username)))
        .emit("join", gameRoom.toObject());
    } else {
      console.log(`room added to queue: ${user.username}`);
      waitingUsers.enqueue(String(user.username));
    }
    console.log(`waiting users: `);
    waitingUsers.print();
  });

  // user sends answer
  // protected (only usable after join)
  socket.on("send-answer", (answer) => {
    const gameRoom = gameRooms.get(gameRoomIds.get(String(user.username)));
    if (gameRoom) {
      console.log("send-answer initiated", gameRoom.roomId);
      gameRoom.submitAnswer(user.username, answer);
      gameRooms.set(gameRoom.roomId, gameRoom);

      // send data to users
      io.to(socket.id)
        .to(activeUsers.get(gameRoom.getOpponent(String(user.username))))
        .emit("recieve-answer", gameRoom.toObject());
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${user?.username}, ${socket.id}`);
    waitingUsers.delete(String(activeUsers.get(user?.username)));
    activeUsers.delete(String(user?.username));
    console.log(activeUsers);
  });
};
