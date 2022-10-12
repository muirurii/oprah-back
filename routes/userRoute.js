const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../config/multer");

route.post("/register", userControllers.registerUser);
route.post("/login", userControllers.logIn);

route.use(verifyToken);

route.get("/user/u/:id", userControllers.getUser);
route.put("/update", upload.any(), userControllers.updateUser);
route.get("/user/liked", userControllers.getLiked);


module.exports = route;