const route = require("express").Router();
const reactionControllers = require("../controllers/reactionControllers");
const verifyToken = require("../middleware/verifyToken");

route.post("/view/:slug", reactionControllers.addView);

route.use(verifyToken);

route.post("/react/:slug", reactionControllers.reactToPost);
route.post("/bookmark/:slug", reactionControllers.bookMarkPost);
// route.post("/comment/:slug", reactionControllers.addComment);
route.post("/comment/react/:id", reactionControllers.reactToComment);

module.exports = route;