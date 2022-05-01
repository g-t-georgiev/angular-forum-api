const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tokenBlacklistSchema = new Schema({
    token: String,
}, { timestamps: true });

// Set expiration time of a TokenBlackList document after 30 days of its creation date (time represented in seconds: 30 * 24 * 3600)
// Set expiration test time of 60 seconds.
tokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;