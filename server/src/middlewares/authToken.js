/**
 * used for authentication of jwt token in secured routes
 */
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authToken = async (req, res, next) => {
  req.user = null;
  try {
    const token = req.cookies?.accessToken;
    const authToken = await jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    );

    // update req.user if authToken is authenticated
    req.user = await User.findById(authToken?._id).select(
      "-password -refresh",
    );
  } catch (error) {
    console.error(error);
  }
  next();
};

export default authToken;
