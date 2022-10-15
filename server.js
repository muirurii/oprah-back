const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "", ".env"),
});
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const allowedOrigins = [
    "https://oprahblog.vercel.app",
    "https://orpahsblog.onrender.com",
    "http://localhost:3000",
    "http://127.0.0.2:5500",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by cors"));
        }
    },
    optionSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

const connection = require("./config/db");
connection();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/comments", require("./routes/commentRoute"));
app.use("/api/reaction", require("./routes/reactionRoute"));

app.use(function(err, req, res, next) {
    res.status(500).json(err.message);
});

app.listen(PORT, (req, res) => {
    console.log("server started at " + PORT);
});