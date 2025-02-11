/**
 * multer middlewares for uploading file via multipart form
 *
 * const multer  = require('multer')
 * const upload = multer({ dest: 'uploads/' })
 * const app = express()
 * app.post('/profile', upload.single('avatar'), function (req, res, next) {
 *   // req.file is the `avatar` file
 *   // req.body will hold the text fields, if there were any
 * })
 */

import multer from "multer";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/temp");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
