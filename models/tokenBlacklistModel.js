const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: String,
}, { timestamps: true });


module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);