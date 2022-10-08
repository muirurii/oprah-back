const router = require("express").Router();
const refreshToken = require("../auth/refreshToken");
const logOut = require("../auth/logOut");

router.get("/", refreshToken);
router.get("/logout", logOut);

module.exports = router;