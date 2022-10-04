const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");

route.post("/register", userControllers.registerUser);
route.post("/login", userControllers.logIn);

route.use(verifyToken);

route.post("/user/:id", userControllers.getUser);
route.put("/update", userControllers.updateUser);
route.get("/user/liked", userControllers.getLiked);


module.exports = route;