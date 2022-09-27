const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const reactToPost = async(req, res) => {
    const { slug } = req.params;
    const { authId } = req.auth;

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.sendStatus(204);
        }
        const user = await User.findOne({ _id: authId });
        if (user === null) {
            return res.sendStatus(204);
        }

        if (post.likes.some(id => id.toString() === authId)) {
            post.likes = post.likes.filter(id => id.toString() !== authId);
            user.likes = post.likes.filter(id => id.toString() !== post._id.toString());
        } else {
            post.likes.push(authId);
            user.likes.push(post._id);
        }

        await post.save();
        await user.save();

        return res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", m: err.message });
    }
}

const bookMarkPost = async(req, res) => {
    const { slug } = req.params;
    const { authId } = req.auth;

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.sendStatus(204);
        }
        const user = await User.findOne({ _id: authId });
        if (user === null) {
            return res.sendStatus(204);
        }

        if (user.bookmarks.some(id => id.toString() === post._id.toString())) {
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== post._id.toString());
        } else {
            user.bookmarks.push(post._id);
        }

        await user.save();

        return res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const addComment = async(req, res) => {
    const { authId, authName } = req.auth;
    const { body } = req.body;
    const { slug } = req.params;

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.sendStatus(204);
        }

        const comment = await Comment.create({
            user: authId,
            body
        });

        post.comments.push(comment._id);
        const populate = await comment.populate("user", "username");
        con
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    reactToPost,
    bookMarkPost,
    addComment,
}