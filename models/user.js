const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locSchema = new Schema({
  city: String,
  state: String 
});

const imgSchema = new Schema({
  image: {
      data: String,
      contentType: String
  }
});

const artistProfSchema = new Schema({
  username: {
    type: String,
    required: true,                  
    unique: true,
    sparse: true
  },
  profPic: imgSchema,
  aboutMe: String,
  // reviews: [reviewSchema],
  clientRating: Number,
  qualityRating: Number,
  location: [locSchema], 
  styles: [String], // TODO: find a way for user to add multiple at once, same for locations
  // stories: [storySchema],
  // ancmts: [ancmtSchema]
});

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  likedPosts: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId],
  artistProf: artistProfSchema,
  googleId: { type: String, required: true },
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);
