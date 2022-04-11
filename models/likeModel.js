const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const likeSchema = new Schema({
    authorId: {
        type: ObjectId,
        ref: 'User'
    },
    postId: {
        type: ObjectId,
        ref: 'Post'
    }
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

const Like = model('Like', likeSchema);

module.exports = Like;