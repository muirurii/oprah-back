const route = require("express").Router();
const postControllers = require("../controllers/postControllers");
const verifyToken = require("../middleware/verifyToken");

// route.use(verifyToken)
route.post('/new', verifyToken, postControllers.createPost);
route.get('/', postControllers.getPosts);
route.put('/:slug', verifyToken, postControllers.updatePost);

// route.get('/featured', postControllers.getFeatured);
// route.get('/:category', postControllers.getCategory);
// route.get('/post/:id', postControllers.getPost);

module.exports = route;