const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 5000;


// Setting routes
app.use('/', require('./routes/api/images'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});