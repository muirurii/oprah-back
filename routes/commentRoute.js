const route = require("express").Router();
const commentControllers = require("../controllers/commentControllers");
const verifyToken = require("../middleware/verifyToken");

route.get("/:postId", commentControllers.getComments);
route.get("/subcomments/:commId", commentControllers.getSubComments);

//Protected routes

route.use(verifyToken);
route.post("/comment/:postId", commentControllers.addComment);
route.post("/subcomment/:commId", commentControllers.addSubComment);

module.exports = route;