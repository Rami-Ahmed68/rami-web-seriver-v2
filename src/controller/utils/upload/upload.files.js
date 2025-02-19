const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../../../public/files"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload_files = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedMimes = [
      "video/mp4",
      "video/webm",
      "video/avi",
      "image/png",
      "image/jpeg",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      new Error(
        JSON.stringify({
          english:
            "Sorry, Invalid file type. Only video & image files are allowed ...",
        })
      );
    }
  },
}).array("files");

module.exports = upload_files;
