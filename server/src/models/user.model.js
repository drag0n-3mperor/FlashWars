import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the User schema using Mongoose
const userSchema = new mongoose.Schema(
    {
        // Username field: required, unique, trimmed, and indexed for faster queries
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        // Full name field: required
        fullname: {
            type: String,
            required: true,
        },
        // Email field: required, unique, trimmed, and indexed for faster queries
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        // Password field: required and trimmed
        password: {
            type: String,
            required: true,
            trim: true,
        },
        // Array of flashcard collection IDs (references to FlashCard documents)
        flashcardCollections: [{
            type: [Schema.Types.ObjectId],
            // ref: "FlashCard", // Uncomment and set the reference if FlashCard model exists
            default: [], // Default to an empty array
        }],
        // Avatar field: required (stores the URL or path to the user's avatar image)
        avatar: {
            type: String,
            required: true,
        },
        // Refresh token field: stores the JWT refresh token for the user
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
);

// Method to validate the user's password
userSchema.methods.isValidPassword = async function (password) {
    // Compare the provided password with the hashed password stored in the database
    return await bcrypt.compare(password, this.password);
};

// Middleware to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(
            this.password,
            parseInt(process.env.BCRYPT_SALT_ROUND) // Hash with the salt rounds defined in environment variables
        );
    }
    next(); // Proceed to save the document
});

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, // Include user ID in the token payload
            email: this.email, // Include email in the token payload
            username: this.username, // Include username in the token payload
        },
        process.env.JWT_ACCESS_TOKEN_SECRET, // Sign the token with the secret key
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY, // Set token expiration time
        }
    );
};

// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id, // Include only the user ID in the refresh token payload
        },
        process.env.JWT_REFRESH_TOKEN_SECRET, // Sign the token with the refresh token secret key
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY, // Set refresh token expiration time
        }
    );
};

// Create and export the User model based on the schema
export const User = mongoose.model("User", userSchema);