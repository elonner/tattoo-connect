var express = require('express');
var router = express.Router();
const artistProfsCtrl = require('../controllers/artist-profs');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// GET /artist-profs/new
router.get('/new', ensureLoggedIn, artistProfsCtrl.new);
// POST /artist-profs
router.post('/', ensureLoggedIn, artistProfsCtrl.create);

module.exports = router;
