const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const url = require("url");

const appDir = path.dirname(require.main.filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGE_STORAGE_LOCATION);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + crypto.randomBytes(10).toString('hex') + "-" + Date.now() + "-" + file.originalname.replace(' ', '-')
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

router.post("/api/images", upload.single('image'), (req, res) => {
  console.log(req.url);
  if (req.fileValidationError) {
    res.status(400).json({status: 400, error: 'file type not supported'});
  } else {
    res.json({status: 200, link: url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: res.req.file.filename
    })});
  }
});

router.get("/:image", (req, res) => {
  res.sendFile(path.join(appDir, process.env.IMAGE_STORAGE_LOCATION, req.params.image));
});

module.exports = router;
