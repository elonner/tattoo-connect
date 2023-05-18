var express = require('express');
var router = express.Router();
const postsCtrl = require('../controllers/posts');
const ensureLoggedIn = require('../config/ensureLoggedIn');
const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});

// QUESTION: should we always be using ensureLoggedIn???
// GET /posts
router.get('/', ensureLoggedIn, postsCtrl.index);
// GET /posts/new
router.get('/new', ensureLoggedIn, postsCtrl.new);
// GET /posts/liked
router.get('/liked', ensureLoggedIn, postsCtrl.showLiked);
// GET /posts/discover
router.get('/discover', postsCtrl.showDiscover)
// GET /posts/:id/edit
router.get('/:id/edit', ensureLoggedIn, postsCtrl.edit);
// PUT /posts/:id
router.put('/:id', ensureLoggedIn, upload.single('newImg'), postsCtrl.update);
// PUT /posts/:id/like
router.put('/:id/like', ensureLoggedIn, postsCtrl.like);
// DELETE /posts/:id
router.delete('/:id', ensureLoggedIn, postsCtrl.delete);
// POST /posts
router.post('/', ensureLoggedIn, upload.single('newImg'), postsCtrl.create);

// GET /posts/images/:id  // NOT USING CURRENTLY but might be useful
router.get('/images/:id', postsCtrl.getImg);

module.exports = router;