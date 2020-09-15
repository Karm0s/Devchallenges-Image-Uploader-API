const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 5000;


// Setting routes
app.use('/api/images', require('./routes/api/images'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});