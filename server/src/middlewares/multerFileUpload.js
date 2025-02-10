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

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "/public/temp");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });