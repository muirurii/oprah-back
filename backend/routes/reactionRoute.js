const route = require("express").Router();
const reactionControllers = require("../controllers/reactionControllers");
const verifyToken = require("../middleware/verifyToken");

route.use(verifyToken);
route.post("/comment/:slug", reactionControllers.addComment)
route.post("/react/:slug", reactionControllers.reactToPost);
route.post("/bookmark/:slug", reactionControllers.bookMarkPost);

module.exports = route;