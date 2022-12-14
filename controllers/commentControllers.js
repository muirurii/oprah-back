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
        const populated = await comment.populate("user", "username profilePic");

        res.json({
            comment: populated,
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
                    select: "username profilePic",
                    model: "User",
                },
            })

        res.json(post.comments);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const addSubComment = async(req, res) => {
    const { authId, authName } = req.auth;
    const { body } = req.body;
    const { commId } = req.params;

    if (!body || body.length < 1) {
        return res.sendStatus(204);
    }

    try {
        const comment = await Comment.findById(commId);
        if (comment === null) {
            return res.sendStatus(204);
        }

        const subComment = await Comment.create({
            user: authId,
            body,
        });

        comment.subComments.push(subComment._id);
        const populated = await subComment.populate("user", "username profilePic");
        await comment.save();

        res.json(populated);

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        console.log(err.message);
    }
}

const getSubComments = async(req, res) => {
    const { commId } = req.params;

    try {
        const comment = await Comment.findById(commId).populate({
            path: "subComments",
            populate: {
                path: "user",
                select: "username profilePic",
                model: "User"
            }
        })
        res.json(comment)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addComment,
    getComments,
    addSubComment,
    getSubComments
};