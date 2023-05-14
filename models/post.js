const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    artist: Schema.Types.ObjectId
});

module.exports = mongoose.model('Post', postSchema);
