const Post = require("../models/Post");
const slugify = require("slugify");

//utility fns

const validator = (value) => (!value || value.length < 2) ? false : true;

const checkDuplicate = async title => await Post.findOne({
    slug: slugify(title, { lower: true, strict: true, })
});


const createPost = async(req, res) => {
    const { title, body, image, categories } = req.body;
    const { authId, authName, role } = req.auth;

    if (!validator(title) || !validator(body) || !validator(image) || !validator(categories)) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const duplicate = await checkDuplicate(title);
        if (duplicate !== null) {
            return res.status(400).json({ message: "title already exists" });
        }

        const category = categories.split(",");

        const post = await Post.create({
            title,
            body,
            creator: authId,
            image,
            category,
        });
        const populated = await post.populate("creator", "username");
        res.json(populated);

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate("creator", "username").sort({ createdAt: -1 });
        res.json(posts)
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updatePost = async(req, res) => {
    const { newTitle, newBody, newImage, newCategories } = req.body;
    const postSlug = req.params.slug;

    const { authId, authName, role } = req.auth;

    if (!validator(postSlug)) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const post = await Post.findOne({ slug: postSlug });

        if (post === null) {
            return res.json({ message: "Post not found" });
        }

        const duplicate = newTitle ? await checkDuplicate(newTitle) : null;
        if (duplicate !== null) {
            return res.status(400).json({ message: "title already exists" });
        }

        if (validator(newTitle)) {
            post.title = newTitle;
        }
        if (validator(newBody)) {
            post.body = newBody;
        }
        if (validator(newImage)) {
            post.image = newImage;
        }
        if (validator(newCategories)) {
            post.category = newCategories.split(",")
        }

        const updatedPost = await post.save();
        res.json(updatedPost);

    } catch (err) {
        res.status(500).json({ message: "Internal server error", m: err.message });
    }
}

const getFeatured = (req, res) => {};


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