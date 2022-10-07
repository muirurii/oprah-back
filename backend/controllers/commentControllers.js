const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const addComment = async(req, res) => {
    const { authId, authName } = req.auth;
    const { body } = req.body;
    const { postId } = req.params;

    if (!body || body.length < 1) {
        return res.sendStatus(204);
    }

    try {
        const post = await Post.findById(postId);
        if (post === null) {
            return res.sendStatus(204);
        }

        const user = await User.findById(authId);
        if (user === null) {
            return res.sendStatus(204);
        }

        const comment = await Comment.create({
            user: user._id,
            body,
        });

        post.comments.push(comment._id);
        await post.save();
        const populated = await comment.populate("user", "username _id");

        res.json({
            comment: populated,
            post,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getComments = async(req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId)
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username",
                    model: "User",
                },
            })
            .select("username");

        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addComment,
    getComments,
};