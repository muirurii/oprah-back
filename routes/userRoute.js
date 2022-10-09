const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");

route.post("/register", userControllers.registerUser);
route.post("/login", userControllers.logIn);

route.use(verifyToken);

route.get("/user/u/:id", userControllers.getUser);
route.post("/user/upload/:id", userControllers.uploadImage);
route.put("/update", userControllers.updateUser);
route.get("/user/liked", userControllers.getLiked);


module.exports = route;