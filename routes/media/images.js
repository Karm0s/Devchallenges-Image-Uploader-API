const express = require("express");
const cors = require("cors");
const path = require("path");

const appDir = path.dirname(require.main.filename);

const router = express.Router();

router.use(cors());

router.get("/:image", (req, res) => {
  res.sendFile(
    path.join(appDir, process.env.IMAGE_STORAGE_LOCATION, req.params.image),
    (err) => {
      if (err) {
        res.status(404).send("<h3>Image not found</h3>");
      }
    }
  );
});

module.exports = router;
