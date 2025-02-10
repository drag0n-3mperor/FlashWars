import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});

import mongoose from "mongoose";
import app from "./src/app.js";

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log("Connected to MongoDB");
    console.log(`Connection URI: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });