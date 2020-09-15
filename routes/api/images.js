const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGE_STORAGE_LOCATION || "./uploads/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "-" + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
  },
});

router.post("/", upload.single('image'), (req, res) => {
  console.log(req.file);
  if (req.fileValidationError) {
    res.status(400).json({status: 400, error: 'file type not supported'});
  } else {
    res.json({status: 200, msg: "Upload OK"});
  }
});

module.exports = router;
