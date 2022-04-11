const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tokenBlacklistSchema = new Schema({
    token: String,
}, { timestamps: true });

const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;