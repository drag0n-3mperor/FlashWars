import { Router } from "express";
const router = Router();

import {
  flashcard_create,
  flashcard_delete,
  flashcard_edit,
  flashcard_view,
  flashcard_view_topicname,
} from "../controllers/flashcard.controller.js";

import authToken from "../middlewares/authToken.js";
//flashcard routes
router.post("/create", authToken, flashcard_create); //Create flashcard
router.get("/view", authToken, flashcard_view); //Flashcard Collection view
router.get("/view/:topic", authToken, flashcard_view_topicname); //Flashcard view of a topic of a particular collection
router.put("/edit/:flashcardId", authToken, flashcard_edit);   // Edit flashcard
router.delete("/delete/:flashcardId", authToken, flashcard_delete); // Delete flashcard

export default router;
