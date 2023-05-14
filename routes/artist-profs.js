var express = require('express');
var router = express.Router();
const artistProfsCtrl = require('../controllers/artist-profs');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// GET /artist-profs/new
router.get('/new', ensureLoggedIn, artistProfsCtrl.new);
// GET /artist-profs
router.get('/', artistProfsCtrl.index);
// GET /artist-profs/:id
router.get('/:id', artistProfsCtrl.show);
// GET /artist-profs/:id/edit
router.get('/:id/edit', ensureLoggedIn, artistProfsCtrl.edit);
// PUT /artist-prof/:id
router.put('/:id', ensureLoggedIn, artistProfsCtrl.update);
// POST /artist-profs
router.post('/', ensureLoggedIn, artistProfsCtrl.create);


module.exports = router;
