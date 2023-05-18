var express = require('express');
var router = express.Router();
const artistProfsCtrl = require('../controllers/artist-profs');
const ensureLoggedIn = require('../config/ensureLoggedIn');
const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});

// GET /artist-profs
router.get('/', artistProfsCtrl.index);
// GET /artist-profs/new
router.get('/new', ensureLoggedIn, artistProfsCtrl.new);
// GET /artist-profs/following
router.get('/following', ensureLoggedIn, artistProfsCtrl.showFollowing)
// GET /artist-profs/:id
router.get('/:username', artistProfsCtrl.show);
// GET /artist-profs/:id/edit
router.get('/:username/edit', ensureLoggedIn, artistProfsCtrl.edit);
// PUT /artist-prof/:id
router.put('/:username', ensureLoggedIn, upload.single('profPic'), artistProfsCtrl.update);
// POST /artist-profs
router.post('/', ensureLoggedIn, upload.single('profPic'), artistProfsCtrl.create);
// POST /artist-profs/:id/follow
router.put('/:username/follow', ensureLoggedIn, artistProfsCtrl.follow);


module.exports = router;
