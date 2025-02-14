import { User } from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";
import { uploadOnCloud } from "../utils/cloudinaryFileUpload.js";
import ms from "ms";
import path from "path";
import jwt from "jsonwebtoken";

const otpStorage = new Map(); // Temporary OTP storage
const userStorage = new Map(); // Temporary user storage

const initiate_register = async (req, res) => {
  try {
    if (req.user != null) {
      return res.status(200).json({ message: "User already signed in." });
    }

    const { username, fullname, email, password } = req.body;
    if (!username || !fullname || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Handle file upload
    const profileImage = req.file ? req.file.path : null;
    console.log(profileImage);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(email, otp);
    userStorage.set(email, {
      username,
      fullname,
      email,
      password,
      profileImage,
    });

    setTimeout(() => {
      otpStorage.delete(email);
      userStorage.delete(email);
    }, 300000); // OTP and user data expire in 5 min

    await sendMail(email, "Your OTP Code For Flashwars", `Your OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully", profileImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verify_otp_and_register = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (!otpStorage.has(email) || otpStorage.get(email) !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const userData = userStorage.get(email);
    if (!userData) {
      return res
        .status(400)
        .json({ message: "User data not found, please restart registration" });
    }

    const filePath = path.resolve(userStorage.get(email).profileImage);
    otpStorage.delete(email);
    userStorage.delete(email);

    // Uploading the file to Cloudinary
    const uploadResponse = await uploadOnCloud(filePath);
    if (!uploadResponse || !uploadResponse.url) {
      return res.status(500).json({ message: "File upload failed" });
    }

    console.log(
      "File uploaded successfully on cloud. Cloud link:",
      uploadResponse.url
    );
    const newUser = new User({
      ...userData,
      avatar: uploadResponse.url,
    });

    await newUser.save();

    // Generate JWT tokens
    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
    const accessTokenExpiry = ms(process.env.JWT_ACCESS_TOKEN_EXPIRY);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      sameSite: "None", // Allows multisite request
      maxAge: refreshTokenExpiry, // 10d expiry from .env
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      sameSite: "None", // Allows multisite request
      maxAge: accessTokenExpiry, // 1d expiry from .env
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const user_login = async (req, res) => {
  try {
    if (req.user != null) {
      return res.status(200).json({ message: "User already signed in." });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not registered!" });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY); //converts in milliseconds
    const accessTokenExpiry = ms(process.env.JWT_ACCESS_TOKEN_EXPIRY);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      sameSite: "None", // Allows multisite request
      secure: true,
      maxAge: refreshTokenExpiry, // 10d expiry from .env
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      sameSite: "None", // Allows multisite request
      secure: true,
      maxAge: accessTokenExpiry, // 10d expiry from .env
    });

    // Responding with success message and tokens
    res.status(201).json({
      message: "User logged-in successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh_access_token = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log("Refresh Token from cookies:", refreshToken);

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized! No refresh token." });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.log("JWT Verification Error:", err.message);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token!" });
    }

    // Find the user in the database
    const user = await User.findById(decoded._id);
    if (!user) {
      console.log("User not found");
      return res.status(403).json({ message: "Invalid refresh token!" });
    }

    // Check if the refresh token matches the one stored in the database
    if (user.refreshToken !== refreshToken) {
      console.log("Token Mismatch! Stored Refresh Token:", user.refreshToken);
      return res.status(403).json({ message: "Invalid refresh token!" });
    }

    // Generate a new access token
    const accessToken = user.generateAccessToken();
    console.log("New Access Token Generated");

    // Send the new access token
    res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({ accessToken });
  } catch (error) {
    console.log("Error refreshing access token:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token!" });
  }
};

const logout_user = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Unauthorized Access" });
    }

    return res
      .status(200)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .json({ message: "User logout successful." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const user_profile = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    // Find the user by the ID from the token
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return user profile details
    res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      avatar: user.avatar, // Assuming avatar is a URL or Cloudinary link
      flashcardCollections: user.flashcardCollections || [],
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  initiate_register,
  verify_otp_and_register,
  user_login,
  refresh_access_token,
  logout_user,
  user_profile,
};
