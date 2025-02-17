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

    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
        maxAge: refreshTokenExpiry, // 10d expiry from .env
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
        maxAge: accessTokenExpiry, // 10d expiry from .env
      })
      .json({ message: "User created successfully" });
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
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    });

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

    // Responding with success message and tokens
    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
        maxAge: refreshTokenExpiry, // 10d expiry from .env
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
        maxAge: accessTokenExpiry, // 10d expiry from .env
      })
      .json({
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
    let accessToken = req.cookies?.accessToken;
    let refreshToken = req.cookies?.refreshToken;

    // Check for missing tokens
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized! No tokens provided." });
    }

    let decoded;
    try {
      // Try verifying the access token
      decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.log("Access token invalid. Attempting to verify refresh token...");

      // Access token invalid, attempt refresh
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized! No refresh token provided." });
      }

      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
      } catch (refreshError) {
        console.log("Refresh token invalid or expired:", refreshError.message);
        return res
          .status(403)
          .clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true })
          .clearCookie("accessToken", { httpOnly: true, sameSite: "None", secure: true })
          .json({ message: "Invalid or expired refresh token!" });
      }
    }

    // User ID from decoded token
    const userId = decoded._id;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Invalid user!" });
    }

    // Check if the refresh token matches
    if (user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true })
        .clearCookie("accessToken", { httpOnly: true, sameSite: "None", secure: true })
        .json({ message: "Invalid refresh token!" });
    }

    // Optional: Only generate new tokens if close to expiry
    const isTokenExpiringSoon = (token) => {
      const expiration = jwt.decode(token).exp * 1000;
      const now = Date.now();
      return expiration - now < 5 * 60 * 1000; // 5-minute threshold
    };

    // Regenerate tokens if necessary
    if (isTokenExpiringSoon(refreshToken)) {
      refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();
    }

    // Always generate a new access token
    accessToken = user.generateAccessToken();

    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
    const accessTokenExpiry = ms(process.env.JWT_ACCESS_TOKEN_EXPIRY);

    // Set the cookies with the new tokens
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: refreshTokenExpiry,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: accessTokenExpiry,
      })
      .json({ message: "Auto signed-in successfully" });
  } catch (error) {
    console.log("Error refreshing access token:", error.message);
    return res.status(403).json({ message: "Invalid or expired refresh token!" });
  }
};


const logout_user = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Unauthorized Access" });
    }

    return res
      .status(201)
      .clearCookie("refreshToken", {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
      })
      .clearCookie("accessToken", {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        sameSite: "None", // Allows multisite request
        secure: true,
      })
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
