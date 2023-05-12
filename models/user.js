const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  likedPosts: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId], 
//   artistProf: artistProfSchema,
  googleId: { type: String, required: true },
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);
