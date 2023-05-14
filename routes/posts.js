var express = require('express');
var router = express.Router();
const postsCtrl = require('../controllers/posts');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// QUESTION: should we always be using ensureLoggedIn???
// GET /posts
router.get('/', ensureLoggedIn, postsCtrl.index);
// GET /posts/new
router.get('/new', ensureLoggedIn, postsCtrl.new);
// GET /posts/:id/edit
router.get('/:id/edit', ensureLoggedIn, postsCtrl.edit);
// PUT /posts/:id
router.put('/:id', ensureLoggedIn, postsCtrl.update)
// DELETE /posts/:id
router.delete('/:id', ensureLoggedIn, postsCtrl.delete);
// POST /posts
router.post('/', ensureLoggedIn, postsCtrl.create)

// GET /posts/images/:id  // NOT USING CURRENTLY but might be useful
router.get('/images/:id', postsCtrl.getImg);

module.exports = router;