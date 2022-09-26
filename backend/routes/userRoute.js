const route = require("express").Router();
const userControllers = require("../controllers/userControllers");

route.post("/register", userControllers.registerUser);
route.post("/login", userControllers.logIn);


module.exports = route;