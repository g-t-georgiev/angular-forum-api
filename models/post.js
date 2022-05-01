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

postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'postId',
    count: true
});

// Populate 'likes' after post update query
postSchema.post('save', function (doc, next) {
    doc
        .populate({
            path: 'likes'
        })
        .then(
            function () {
                next();
            }
        )

});

const Post = model('Post', postSchema);

module.exports = Post;
