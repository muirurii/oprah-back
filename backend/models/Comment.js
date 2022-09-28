const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
    },
    subComments: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
        ref: "Comment"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", CommentSchema);