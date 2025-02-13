import { Router } from "express";
import authToken from "../middlewares/authToken.js";
import { upload } from "../middlewares/multerFileUpload.js";
import {
  initiate_register,
  user_login,
  verify_otp_and_register,
  refresh_access_token,
  logout_user,
  user_profile,
} from "../controllers/user.controller.js";

const router = Router();

// Apply multer for file uploads in registration and OTP verification
router.post(
  "/register",
  authToken,
  upload.single("profileImage"),
  initiate_register
);
router.post("/verify-otp", verify_otp_and_register);
router.post("/login", authToken, user_login);
router.get("/logout", authToken, logout_user);
router.get("/refresh", refresh_access_token); // Auto sign-in route
router.get("/profile", user_profile);
export default router;
