import { Router } from "express";
import authToken from "../middlewares/authToken.js";
import { user_search } from "../controllers/search.controller.js";

const router = Router();

router.get("/username/:username" ,authToken , user_search);

export default router;