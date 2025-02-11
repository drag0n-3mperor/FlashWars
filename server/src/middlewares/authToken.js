/**
 * a middleware which is
 * used for authentication of jwt token in secured routes
 */
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authToken = async (req, res, next) => {
  req.user = null;
  try {
    const token = req.cookies?.accessToken;
    console.log("Access Token from cookies:", token); // ✅ Debugging log

    if (!token) return next(); // Skip if no token is provided

    const authToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", authToken); // ✅ Debugging log

    if (!authToken?._id) return next(); // Skip if invalid token

    req.user = await User.findById(authToken._id).select("-password -refreshToken");
    console.log("User Found:", req.user); // ✅ Debugging log

  } catch (error) {
    console.error("Auth error:", error);
  }
  next();
};



export default authToken;
