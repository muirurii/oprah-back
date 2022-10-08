const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "USER",
    },
    profilePic: {
        type: String,
        default: ""
    },
    bookmarks: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Post",
        default: []
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Post",
        default: [],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);