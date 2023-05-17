const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const imgSchema = new Schema({
    image: {
        data: String,
        contentType: String
    }
});

const postSchema = new Schema({
    content: {
        type: [imgSchema],
        required: true
    },
    caption: String,
    date: {
        type: Date,
        required: true
    },
    tags: [String],
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likedBy: [Schema.Types.ObjectId]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
