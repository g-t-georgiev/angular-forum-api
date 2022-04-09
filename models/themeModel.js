const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const themeSchema = new mongoose.Schema({
    themeName: {
        type: String,
        required: true
    },
    subscribers: [{
        type: ObjectId,
        ref: "User"
    }],
    userId: {
        type: ObjectId,
        ref: "User"
    },
    posts: [{
        type: ObjectId,
        ref: "Post"
    }],
}, { 
    timestamps: true, 
    toJSON: {
        virtuals: true
    }, 
    toObject: {
        virtuals: true
    } });

themeSchema.virtual('subscriptions')
    .get(
        function () {
            return this.subscribers?.length;
        }
    );

module.exports = mongoose.model('Theme', themeSchema);