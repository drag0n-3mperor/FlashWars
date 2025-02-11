import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import flashcardRoutes from "../src/routes/flashcard.route.js"
import userRoutes from "../src/routes/user.route.js"
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: "Content-Type"
  }
));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE"]);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/flashcards' , flashcardRoutes );
app.use('/users',userRoutes)
export default app;