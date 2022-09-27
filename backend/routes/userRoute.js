const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");

route.post("/register", userControllers.registerUser);
route.post("/login", userControllers.logIn);
route.put("/update", verifyToken, userControllers.updateUser);


module.exports = route;