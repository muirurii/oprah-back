const express = require("express");
const postsRoute = express.Router();
const postControllers = require("../controllers/postControllers");


postsRoute.get('/', postControllers.getPosts);
postsRoute.get('/featured', postControllers.getFeatured);
postsRoute.get('/:category', postControllers.getCategory);
postsRoute.get('/post/:id', postControllers.getPost);

module.exports = postsRoute;