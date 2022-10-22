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
    cloudinaryId: {
        type: String,
        default: ""
    },
    excerpt: {
        type: String,
        default: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quidem in magnam iure odio libero consectetur quam. Temporibus libero, dolorum dignissimos quaerat a quia autem sed corrupti amet eaque quae laudantium quasi porro corporis placeat odit repellat ducimus sit. Labore excepturi libero recusandae nihil aliquam dolores obcaecati, natus ratione esse in tempora, nam voluptatem nobis alias, veritatis porro praesentium ipsum vitae modi repellat corporis. Hic soluta eligendi ut quibusdam, omnis repellat fugiat alias impedit sint minus at quos quo laborum nemo a, excepturi tenetur mollitia magni? Voluptates ratione non tenetur accusamus assumenda,
         laborum magni soluta similique iure illum corrupti earum obcaecati!`
    },
    body: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
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