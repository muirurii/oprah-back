const Post = require("../models/Post");
const slugify = require("slugify");

//utility fns

const validator = (value) => (!value || value.length < 2 ? false : true);

const checkPost = async(title) =>
    await Post.findOne({
        slug: slugify(title, { lower: true, strict: true }),
    });

const createPost = async(req, res) => {
    const { title, body, image, categories } = req.body;
    const { authId, authName, role } = req.auth;

    if (!validator(title) ||
        !validator(body) ||
        !validator(image) ||
        !validator(categories)
    ) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const duplicate = await checkPost(title);
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
};

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find()
            .populate("creator", "username")
            .populate("comments")
            .sort({ createdAt: "descending" });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", m: err.message });
    }
};

const updatePost = async(req, res) => {
    const { oldTitle, newTitle, newBody, newImage, newCategories } = req.body;
    const postSlug = req.params.slug;

    const { authId, authName, role } = req.auth;

    if (role !== "ADMIN") {
        return res.status(403).json({ message: "Cannot update post" });
    }

    if (!validator(postSlug)) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const post = await Post.findOne({ slug: postSlug });

        if (post === null) {
            return res.json({ message: "Post not found" });
        }

        const duplicate = newTitle !== oldTitle ? await checkPost(newTitle) : null;

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
            post.category = newCategories.split(",");
        }

        const updatedPost = await (
            await post.save()
        ).populate("creator", "username");
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", m: err.message });
    }
};

const getFeatured = async(req, res) => {
    try {
        const featured = await Post.find({ featured: true })
            .populate("creator", "username")
            .populate("comments")
            .sort({ createdAt: "descending" });
        res.json(featured);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPost = async(req, res) => {
    const { slug } = req.params;

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.json({ message: "Post not found" });
        }
        const populated = await (
            await post.populate("creator", "username")
        ).populate("comments");
        res.json(populated);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deletePost = async(req, res) => {
    const { slug } = req.params;
    const { role } = req.auth;

    if (role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const post = await Post.findOneAndDelete({ slug });
        if (post === null) {
            return res.status(400).json({ message: "Post not found" });
        }
        res.json({
            message: `Post ${post.slug} deleted`,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    getFeatured,
    deletePost,
};