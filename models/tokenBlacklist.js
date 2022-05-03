const env = process.env.NODE_ENV ?? 'development';
const documentExpireTimeOptions = {
    production: 30 * 24 * 3600, // 30 days
    development: 60 // 1 minute
};

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tokenBlacklistSchema = new Schema({
    token: String,
}, { timestamps: true });

tokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: documentExpireTimeOptions[env] });

const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;