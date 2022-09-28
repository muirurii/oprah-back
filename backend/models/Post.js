const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    image: {
        type: String,
        required: true,
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
        ref: "User",
        default: [],
    },
    comments: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Comment",
        default: [],
    },
}, {
    timestamps: true,
});

PostSchema.pre("validate", function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }
    next();
});


module.exports = mongoose.model("Post", PostSchema);