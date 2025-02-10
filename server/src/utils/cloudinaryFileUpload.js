/**
 * utility function for uploading files on cloudinary
 * accepts the local path of the file to be uploaded
 * returns the cloud url to the uploaded file
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloud = async (localFilePath) => {
  try {
    // configuring cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!localFilePath) {
      // if file is not found locally
      console.error(`File path not available`);
      return null;
    }

    // upload file on cloud
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(`File uploaded successfully on cloud. Cloud link: ${response.url}`);

    // remove file from local storage
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(`File uploading failed!`);
    console.error(error);
    fs.unlinkSync(localFilePath);
    throw error;
  }
};

export { uploadOnCloud };
