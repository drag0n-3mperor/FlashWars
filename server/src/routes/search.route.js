import { Router } from "express";
import authToken from "../middlewares/authToken.js";
import { user_search } from "../controllers/search.controller.js";
import { flashcard_view_all_topicname } from "../controllers/flashcard.controller.js"
const router = Router();

router.get("/username/:username" ,authToken , user_search);
router.get("/:searchQuery" , flashcard_view_all_topicname)

export default router;