const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post')

module.exports = {
  new: newProf,
  create,
  index,
  show,
  edit,
  update
}

// renders artist sign up sheet
function newProf(req, res) {
  res.render('artist-profs/new', { title: 'Tattoo Connect', errorMsg: 'Cannot Show Sign Up Form' });
}

// handles artist sign up sheet submission
async function create(req, res) {
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
  const artist = await User.findById(req.params.id);
  const posts = await Post.find({ artist: artist._id });
  res.render(`artist-profs/show`, { title: 'Tattoo Connect', errorMsg: 'Cannot Show Artist', artist, posts })
}

async function edit(req, res) {
  if (!req.user._id.equals(req.params.id)) return res.redirect('/');
  res.render(`artist-profs/edit`, { id: req.params.id, title: 'Tattoo Connect', errorMsg: 'Cannot edit post' });
}

async function update(req, res) {
  if (!req.user._id.equals(req.params.id)) return res.redirect('/');
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
    res.redirect(`/artist-profs/${req.params.id}/edit`, { errorMsg: err.message });
  }
}