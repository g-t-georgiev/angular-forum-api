const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const themeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "User"
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

themeSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'themeId'
});

themeSchema.virtual('subscribers', {
    ref: 'User',
    localField: '_id',
    foreignField: 'themeId'
});

const Theme = model('Theme', themeSchema);

module.exports = Theme;