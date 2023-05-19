const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

module.exports = {
  new: newProf,
  create,
  index,
  show,
  edit,
  update,
  follow,
  showFollowing
}

// RENDER artist-profs/new --> artist sign up form
function newProf(req, res) {
  if (req.user.artistProf) return res.redirect('/');
  res.render('artist-profs/new', { errorMsg: 'Cannot Show Sign Up Form' });
}

// REDIRECT / --> creates artist profile from artist sign up form submission
async function create(req, res) {
  if (req.user.artistProf) return res.redirect('/');  // should be unreachable 
  for (let key in req.body) {                         // empty inputs
    if (req.body[key] === '') delete req.body[key];
  }
  // translate form info to fit schema
  const user = req.user;
  if (req.body.phone) {
    user.phone = req.body.phone;
    delete req.body.phone;
  }
  req.body.styles = req.body.styles?.split(',').map(s => s.trim());
  req.body.location = [{ city: req.body.city, state: req.body.state }];
  let placeholder;
  if (!req.file) {
    placeholder = 'https://bulma.io/images/placeholders/96x96.png'; // no file
  }
  else if (!isImg(req.file.mimetype)) {                             // not image file
    console.log('You must upload a jpeg or png');
    fs.unlinkSync(__basedir + `/public/uploads/${req.file.filename}`);
    return res.redirect('/artist-profs/new');
  }
  let temp;
  if (placeholder) {
    temp = {
      image: {
        data: `${placeholder}`,
        contentType: 'image/png'
      },
    };
  } else {
    temp = {
      image: {
        data: path.join("/uploads/" + req.file.filename),
        contentType: req.file.mimetype
      },
    };
  }
  req.body.profPic = temp;
  user.artistProf = req.body;
  try {
    await user.save();
    res.redirect(`/`);
  } catch (err) {
    console.log(err);
    res.redirect('/artist-profs/new');
  }
}

// RENDER artist-profs/index --> shows all artist profiles besides the artist that is currently logged in
async function index(req, res) {
  try {
    const artists = await User.find({ $and: [{ artistProf: { $exists: true } }, { _id: { $ne: req.user?._id } }] });
    res.render('artist-profs/index', { errorMsg: 'Cannot show artist.', artists })
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
}

// RENDER artist-profs/show --> shows an artist's profile page 
async function show(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  const posts = await Post.find({ artist: artist._id }).populate('artist');
  if (artist._id.equals(req.user?._id)) {       // if the artist tries to view their own profile it redirects to their own posts
    res.redirect('/posts');
  } else {
    res.render(`artist-profs/show`, { errorMsg: 'Cannot Show Artist', user: req.user, artist, posts });
  }
}

// RENDER artist-profs/edit --> shows edit profile form
async function edit(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');     // should be unreachable
  res.render(`artist-profs/edit`, { errorMsg: 'Cannot edit post' });
}

// REDIRECT /posts --> updates artist profile from artist edit profile form submission
async function update(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');     // should be unreachable
  // assign the filled out input values to the artist profile
  const prof = req.user.artistProf;
  if (!!req.body.number) req.user.number = req.body.number;
  if (!!req.body.username) prof.username = req.body.username;
  if (!!req.body.aboutMe) prof.aboutMe = req.body.aboutMe;
  if (!!req.body.styles) prof.styles = req.body.styles.split(',').map(t => t.trim())
  if (req.body.city && req.body.state) prof.location = [{ city: req.body.city, state: req.body.state }];
  const image = req.file;
  if (image) {
    if (!isImg(image.mimetype)) {              // make sure file is an image
      console.log('You must upload a jpeg or png');
      fs.unlinkSync(__basedir + `/public/uploads/${image.filename}`); // destroy wrong file
      return res.redirect(`/artist-profs/${req.params.username}/edit`);
    }
    fs.unlinkSync(__basedir + `/public/${prof.profPic.image.data}`); // destroy the old image
    prof.profPic = {
      image: {
        data: path.join("/uploads/" + image.filename),
        contentType: image.mimetype
      },
    }
  }
  try {
    await req.user.save();
    res.redirect(`/posts`);
  } catch (err) {
    console.log(err);
    res.redirect(`/artist-profs/${req.params.username}/edit`, { errorMsg: err.message });
  }
}

// REDIRECT /artist-profiles/:username --> follows or unfollows artist
async function follow(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (req.user.following.includes(artist._id)) {
    req.user.following.splice(req.user.following.indexOf(artist._id), 1);   // UNFOLLOW
  }
  else req.user.following.push(artist._id);                                 // FOLLOW
  try {
    await req.user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/artist-profs/${req.params.username}`)
}

// RENDER artist-profs-following --> shows posts from the artists the user is following 
async function showFollowing(req, res) {
  try {
    const artists = await User.find({ _id: { $in: req.user.following } });
    res.render('artist-profs/following', { errorMsg: 'Cannot show artist.', artists })
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
}

// helper function to ensure file upload is an image
function isImg(mimetype) {
  const validImgTypes = ['image/jpeg', 'image/png'];
  return validImgTypes.includes(mimetype);
}