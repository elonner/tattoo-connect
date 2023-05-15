const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const postSchema = new Schema({
    content: {
        type: [Object],
        required: true
    },
    caption: String,
    date: {
        type: Date,
        required: true
    },
    tags: [String],
    artist: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
