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

        if (
            post.likes.length > 0 &&
            post.likes.some((id) => id.toString() === authId)
        ) {
            post.likes = post.likes.filter((id) => id.toString() !== authId);
            user.likes = post.likes.filter(
                (id) => id.toString() !== post._id.toString()
            );
        } else {
            post.likes.push(authId);
            user.likes.push(post._id);
        }

        await post.save();
        await user.save();

        return res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

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

        if (user.bookmarks.some((id) => id.toString() === post._id.toString())) {
            user.bookmarks = user.bookmarks.filter(
                (id) => id.toString() !== post._id.toString()
            );
        } else {
            user.bookmarks.push(post._id);
        }

        await user.save();

        return res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const addComment = async(req, res) => {
    const { authId, authName } = req.auth;
    const { body } = req.body;
    const { slug } = req.params;

    if (!body || body.length < 1) {
        return res.sendStatus(204);
    }

    try {
        const post = await Post.findOne({ slug });
        if (post === null) {
            return res.sendStatus(204);
        }

        const user = await User.findById(authId);
        if (user === null) {
            return res.sendStatus(204);
        }

        const comment = await Comment.create({
            user: user.username,
            body,
        });

        post.comments.push(comment._id);
        await post.save();

        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const reactToComment = async(req, res) => {
    const { id } = req.params;
    const { authId } = req.auth;

    try {
        const comment = await Comment.findById(id);

        if (comment === null) {
            return res.sendStatus(204);
        }

        const user = await User.findOne({ _id: authId });
        if (user === null) {
            return res.sendStatus(204);
        }

        if (
            comment.likes.length > 0 &&
            comment.likes.some((id) => id.toString() === authId)
        ) {
            comment.likes = comment.likes.filter((id) => id.toString() !== authId);
        } else {
            comment.likes.push(authId);
        }

        await comment.save();

        return res.json(comment);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const addView = async(req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.sendStatus(204);
    }
    try {
        const post = await Post.find({ slug });
        if (!post) {
            return res.sendStatus(204);
        }

        const updated = await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
        res.json({ views: updated.views });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    reactToPost,
    addView,
    bookMarkPost,
    addComment,
    reactToComment,
};