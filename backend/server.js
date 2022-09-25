const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/posts', require("./routes/postsRoute"));

app.listen(PORT, (req, res) => {
    console.log("server started at " + PORT);
});