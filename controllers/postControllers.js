const Post = require("../models/Post");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const { update } = require("../models/Post");

//utility fns

const validator = (value) => Boolean(value) && value.length >= 2;

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

        const uploadedImage = await cloudinary.uploader.upload(
            image, {
                upload_preset: "blog",
                folder: "pictures"
            }
        );

        const post = await Post.create({
            title,
            body,
            creator: authId,
            image: uploadedImage.secure_url,
            cloudinaryId: uploadedImage.public_id,
            category,
        });

        const populated = await post.populate("creator", "username");
        res.json(populated);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPosts = async(req, res) => {
    const { sortProp, sortValue } = req.query;
    const search = req.query.search || "";

    try {
        const posts = await Post.find({
                $or: [{ "body": { "$regex": search, "$options": "i" } },
                    { "title": { "$regex": search, "$options": "i" } }
                ]
            })
            .populate("creator", "username")
            .sort({
                [sortProp]: sortValue
            });

        const totalPosts = Post.length;
        res.json({ posts, totalPosts });
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
        if (!newImage.startsWith("https://")) {
            const uploadedImage = await cloudinary.uploader.upload(
                newImage, {
                    upload_preset: "blog",
                    folder: "pictures"
                }
            );

            post.image = uploadedImage.secure_url;
            post.cloudinaryId = uploadedImage.public_id;
        }
        if (validator(newCategories)) {
            post.category = newCategories.split(",");
        }

        const updatedPost = await (
            await post.save()
        ).populate("creator", "username");

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFeatured = async(req, res) => {
    try {
        const featured = await Post.where("views")
            .gt(5)
            .populate("creator", "username")
            .populate("comments")
            .sort({ views: "descending" })
            .limit(3);
        const latest = await Post.find()
            .populate("creator", "username")
            .populate("comments")
            .sort({ createdAt: "descending" })
            .limit(3);

        res.json({ featured, latest });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPost = async(req, res) => {
    const { slug } = req.params;

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.status(404).json({ message: "Post not found" });
        }
        const populated = await (
            await post.populate("creator", "username")
        ).populate("comments");

        const others = await Post.find({ _id: { $ne: post._id } })
            .limit(5)
            .populate("creator", "username")
            .populate("comments");

        res.json({
            post: populated,
            recommended: others,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCategory = async(req, res) => {
    const { category } = req.params;

    try {
        const posts = await Post.find({ category });
        if (posts.length < 1) {
            return res.status(404).json({ message: "No category found" });
        }
        res.json(posts);
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
    getCategory,
    deletePost,
};