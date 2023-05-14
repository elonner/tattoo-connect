const mongoose = require('mongoose');

module.exports = {
  new: newProf,
  create 
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