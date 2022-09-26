const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const connection = require("./config/db");
connection();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/posts', require("./routes/postsRoute"));
app.use('/api/users', require("./routes/userRoute"));

app.listen(PORT, (req, res) => {
    console.log("server started at " + PORT);
});