const route = require("express").Router();
const commentControllers = require("../controllers/commentControllers");
const verifyToken = require("../middleware/verifyToken");

route.get("/:postId", commentControllers.getComments);

//Protected routes

route.use(verifyToken);
route.post("/comment/:postId", commentControllers.addComment);

module.exports = route;