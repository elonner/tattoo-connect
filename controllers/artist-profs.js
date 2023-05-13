const User = require('../models/user');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  new: newProf,
  create 
};

function newProf(req, res) {
    res.render('artist-profs/new', { title: 'Tattoo Connect', errorMsg: 'Cannot Show Sign Up Form' });
};

async function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const user = req.user;
  if (req.body.phone) {
    user.phone = req.body.phone;
    delete req.body.phone;
  }
  req.body.styles = req.body.style.split(',');
  req.body.location = [{city: req.body.city, state: req.body.state}];
  user.artistProf = req.body;
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/`);
  console.log(user);            // CONSOLE LOG
}