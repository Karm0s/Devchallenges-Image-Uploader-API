const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const url = require("url");
const { time } = require("console");
const { basename } = require("path");

const appDir = path.dirname(require.main.filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGE_STORAGE_LOCATION);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        crypto.randomBytes(10).toString("hex") +
        "-" +
        Date.now() +
        "-" +
        file.originalname.replace(" ", "-")
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

let timeOuts = []; // store timers to trigger image deletion
let TIMEOUT = 1000 * 60 * 60 * 24; // 24 Hours timeout

router.post("/api/images", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (req.fileValidationError) {
    res.status(400).json({ status: 400, error: "file type not supported" });
  } else {
    res.json({
      status: 200,
      link: url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: res.req.file.filename,
      }),
    });
    const timer = setTimeout(() => {
      fs.unlink(path.join(appDir, req.file.path), (err) => {
        if (err) throw err;
      });
    }, TIMEOUT);
    timeOuts.push(timer);
  }
});

router.get("/:image", (req, res) => {
  res.sendFile(
    path.join(appDir, process.env.IMAGE_STORAGE_LOCATION, req.params.image),
    (err) => {
      if (err) {
        res.status(404).send("Image not found");
      }
    }
  );
});

module.exports = router;
