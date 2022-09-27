const route = require("express").Router();
const postControllers = require("../controllers/postControllers");
const verifyToken = require("../middleware/verifyToken");

/* Unprotected routes */

route.get('/', postControllers.getPosts);
route.get('/featured', postControllers.getFeatured);
route.get('/:slug', postControllers.getPost);

/* Protected routes */
route.use(verifyToken)

route.post('/new', postControllers.createPost);
route.put('/:slug', postControllers.updatePost);
route.delete('/:slug', postControllers.deletePost);

module.exports = route;