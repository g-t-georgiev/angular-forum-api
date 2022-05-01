const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const subscriptionSchema = new Schema({
    authorId: {
        type: ObjectId,
        ref: 'User'
    },
    themeId: {
        type: ObjectId,
        ref: 'Theme'
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

const Subscription = model('Subscription', subscriptionSchema);

module.exports = Subscription;