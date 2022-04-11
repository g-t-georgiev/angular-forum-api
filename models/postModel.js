const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

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
},  {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

const Post = model('Post', postSchema);

module.exports = Post;
