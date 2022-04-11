const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "User"
    },
    themeId: {
        type: ObjectId,
        ref: "Theme"
    },
}, { timestamps: true });

const Post = model('Post', postSchema);

module.exports = Post;
