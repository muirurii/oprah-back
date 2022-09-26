const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    image: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
    },
    comments: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);