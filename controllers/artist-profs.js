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
  let placeholder;
  if (!req.file) {
    placeholder = 'https://bulma.io/images/placeholders/96x96.png';
  }
  else if (!isImg(req.file.mimetype)) {
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
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  const posts = await Post.find({ artist: artist._id }).populate('artist');
  if (!artist._id.equals(req.user._id)) {
    res.render(`artist-profs/show`, { title: 'Tattoo Connect', errorMsg: 'Cannot Show Artist', user: req.user, artist, posts })
  } else res.redirect('/posts');
}

async function edit(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');
  res.render(`artist-profs/edit`, { title: 'Tattoo Connect', errorMsg: 'Cannot edit post' });
}

async function update(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (!req.user._id.equals(artist._id)) return res.redirect('/');
  const prof = req.user.artistProf;

  if (req.body.username !== '') prof.username = req.body.username;
  if (req.body.number !== '') req.user.number = req.body.number;
  if (req.body.styles !== '') prof.styles = req.body.styles.split(',').map(t => t.trim())
  if (req.body.city && req.body.state) prof.location = [{ city: req.body.city, state: req.body.state }];
  if (req.file) {
    if (!isImg(req.file.mimetype)) {
      console.log('You must upload a jpeg or png');
      fs.unlinkSync(__basedir + `/public/uploads/${req.file.filename}`);
      return res.redirect(`/artist-profs/${req.params.username}/edit`);
    }
    prof.profPic = {
      image: {
        data: path.join("/uploads/" + req.file.filename),
        contentType: req.file.mimetype
      },
    };
  }
  try {
    await req.user.save();
    res.redirect(`/posts`);
  } catch (err) {
    console.log(err);
    res.redirect(`/artist-profs/${req.params.username}/edit`, { errorMsg: err.message });
  }
}

async function follow(req, res) {
  const artist = await User.findOne({ 'artistProf.username': req.params.username });
  if (req.user.following.includes(artist._id)) {
    req.user.following.splice(req.user.following.indexOf(artist._id), 1);
  }
  else req.user.following.push(artist._id);
  try {
    await req.user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/artist-profs/${req.params.username}`)
}

async function showFollowing(req, res) {
  try {
    const artists = await User.find({ _id: { $in: req.user.following }});
    res.render('artist-profs/following', { errorMsg: 'Cannot show artist.', artists })
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
}

function isImg(mimetype) {
  const validImgTypes = ['image/jpeg', 'image/png'];
  return validImgTypes.includes(mimetype);
}