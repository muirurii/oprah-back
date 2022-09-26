const route = require("express").Router();
const postControllers = require("../controllers/postControllers");
const verifyToken = require("../middleware/verifyToken");

// route.use(verifyToken)
route.post('/new', verifyToken, postControllers.createPost);

// route.get('/', postControllers.updatePost);
route.get('/', postControllers.getPosts);
// route.get('/featured', postControllers.getFeatured);
// route.get('/:category', postControllers.getCategory);
// route.get('/post/:id', postControllers.getPost);

module.exports = route;