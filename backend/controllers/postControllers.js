const Post = require("../models/Post");

const createPost = async(req, res) => {
    const { title, body, image, categories } = req.body;
    const { _id, username, role } = req.auth;

    if (!title || !body || !image || !categories || title.length < 1 || body.length < 1 || image.length < 1 || categories.length < 1) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const category = categories.split(",")

    console.log(username)
    try {
        const post = await Post.create({
            title,
            body,
            creator: "",
            image,
            category,
            _id
        });

        res.json(post);

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updatePost = async(req, res) => {
    // const { title, body, image, categories, } = req.body;

    // if (!title || !body || !image || !categories || title.length < 1 || body.length < 1 || image.length < 1 || categories.length < 1) {
    //     return res.status(400).json({ message: "Please fill all fields" });
    // }

    // const category = categories.split(",")

    try {
        // const post = Post.findByIdAndUpdate()

        // const post = await Post.create({
        //     title,`
        //     body,
        //     image,
        //     category
        // });

        // res.json(post);

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getFeatured = (req, res) => {
    // res.json({
    //     latest: posts.slice(0, 3),
    //     popular: posts.slice(3, 6),
    // });
};

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    } catch (e) {

    }
};

const getPost = (req, res) => {
    // const id = req.params.id;
    // const post = posts.find((post) => post.id === +id);

    // if (!post) {
    //     return res.status(404).json({ message: "Post not found" });
    // }
    // res.json({
    //     post,
    //     more: posts.slice(0, 3),
    // });
};

module.exports = { createPost, updatePost, getPosts, getPost, getFeatured };