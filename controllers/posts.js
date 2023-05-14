const Post = require('../models/post');
const mongoose = require('mongoose');

module.exports = {
    new: newPost,
    create,
    index,
    getImg,
    delete: deletePost,
    edit,
    update
}

// render form to make a post
function newPost(req, res) {
    res.render('posts/new', { title: 'Tattoo Connect', errorMsg: 'Cannot Show Post Upload Form' });
}

// handles artist post upload form submission
async function create(req, res) {
    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
    req.body.date = new Date();
    req.body.tags = req.body.tags?.split(',').map(t => t.trim());
    req.body.artist = req.user._id;
    const { image } = req.files;
    if (!isImg(image.mimetype)) {
        console.log('You must upload a jpeg or png');
        return res.redirect('/posts/new');
    }
    req.body.content = req.files;
    try {
        await Post.create(req.body);
        res.redirect(`/posts`);
    } catch (err) {
        console.log(err);
        res.render('posts/new', { errorMsg: err.message });
    }
}

// shows all of a users posts
async function index(req, res) {
    const posts = await Post.find({ artist: req.user._id });
    res.render('posts/index', { posts, title: 'Tattoo Connect', errorMsg: 'Cannot show all posts' });
}

async function deletePost(req, res) {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect(`/posts`);
}

function edit(req, res) {
    res.render(`posts/edit`, { id: req.params.id, title: 'Tattoo Connect', errorMsg: 'Cannot edit post' });
}

async function update(req, res) {
    const image = req.files?.image;
    if (image && !isImg(image.mimetype)) { // if a file was uploaded and it is not an image
        console.log('You must upload a jpeg or png');
        return res.redirect('/posts/<%= req.params.id %>/edit');
    }
    const post = await Post.findById(req.params.id);
    if (req.body.caption !== '') post.caption = req.body.caption;
    if (req.body.tags !== '') post.tags = req.body.tags.split(',').map(t => t.trim())
    if (image) post.content = req.files;
    try {
        await post.save();
        res.redirect(`/posts`);
    } catch (err) {
        console.log(err);
        res.redirect('/posts/edit', { errorMsg: err.message });
    }
}

// NOT USING CURRENTLY but might be useful to have the images available as an API
async function getImg(req, res) {
    let image = (await Post.find({}))[0]?.content[0].image;
    res.contentType(image.mimetype);
    res.send(image.data);
}

function isImg(mimetype) {
    const validImgTypes = ['image/jpeg', 'image/png'];
    return validImgTypes.includes(mimetype);
}

