const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: 0,
    },
    subComments: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
        ref: "Comment"
    }
});

module.exports = mongoose.model("Comment", CommentSchema);