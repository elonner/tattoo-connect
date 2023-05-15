const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const { findOne } = require('../models/user');

module.exports = {
  new: newProf,
  create,
  index,
  show,
  edit,
  update,
  follow
}

// renders artist sign up sheet
function newProf(req, res) {
  if (req.user.artistProf) return res.redirect('/');
  res.render('artist-profs/new', { title: 'Tattoo Connect', errorMsg: 'Cannot Show Sign Up Form' });
}

// handles artist sign up sheet submission
async function create(req, res) {
  if (req.user.artistProf) return res.redirect('/');
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const user = req.user;
  if (req.body.phone) {
    user.phone = req.body.phone;
    delete req.body.phone;
  }
  req.body.styles = req.body.styles?.split(',').map(s => s.trim());
  req.body.location = [{ city: req.body.city, state: req.body.state }];
  user.artistProf = req.body;
  try {
    await user.save();
    res.redirect(`/`);
  } catch (err) {
    console.log(err);
    res.redirect('/artist-profs/new');
  }
}

async function index(req, res) {
  try {
    const artists = await User.find({ $and: [{ artistProf: { $exists: true } }, { _id: { $ne: req.user?._id } }] });
    res.render('artist-profs/index', { title: 'Tattoo Connect', errorMsg: 'Cannot show artist.', artists })
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
}

async function show(req, res) {
  // const artist = await User.findOne({ artistProf: { username: { $eq: req.params.username } }});
  const artist = await User.findOne({ 'artistProf.username' : req.params.username });
  const posts = await Post.find({ artist: artist.artistProf.username });
  res.render(`artist-profs/show`, { title: 'Tattoo Connect', errorMsg: 'Cannot Show Artist', user: req.user, artist, posts })
}

async function edit(req, res) {
  const artist = await User.findOne({ 'artistProf.username' : req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');
  res.render(`artist-profs/edit`, { username: req.params.username, title: 'Tattoo Connect', errorMsg: 'Cannot edit post' });
}

async function update(req, res) {
  const artist = await User.findOne({ 'artistProf.username' : req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');
  const prof = req.user.artistProf;

  if (req.body.username !== '') prof.username = req.body.username;
  if (req.body.number !== '') req.user.number = req.body.number;
  if (req.body.styles !== '') prof.styles = req.body.styles.split(',').map(t => t.trim())
  if (req.body.city && req.body.state) prof.location = [{ city: req.body.city, state: req.body.state }];
  try {
    await req.user.save();
    res.redirect(`/posts`);
  } catch (err) {
    console.log(err);
    res.redirect(`/artist-profs/${req.params.username}/edit`, { errorMsg: err.message });
  }
}

async function follow(req, res) {
  if (req.user.following.includes(req.params.username)) {
    req.user.following.splice(req.user.following.indexOf(req.params.username), 1);
  }
  else req.user.following.push(req.params.username);
  try {
    await req.user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/artist-profs/${req.params.username}`)
}