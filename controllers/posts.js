const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports = {
    new: newPost,
    create,
    index,
    getImg,
    delete: deletePost,
    edit,
    update,
    homeFeed,
    like,
    showLiked
}

// render form to make a post
function newPost(req, res) {
    if (!req.user.artistProf) return res.redirect('/');
    res.render('posts/new', { title: 'Tattoo Connect', errorMsg: 'Cannot Show Post Upload Form' });
}

// handles artist post upload form submission
async function create(req, res) {
    if (!req.user.artistProf) return res.redirect('/');
    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
    req.body.date = new Date();
    req.body.tags = req.body.tags?.split(',').map(t => t.trim());
    req.body.artist = req.user.artistProf.username;
    if (!isImg(req.file.mimetype)) {
        console.log('You must upload a jpeg or png');
        fs.unlinkSync(__basedir + `/public/uploads/${req.file.filename}`);
        return res.redirect('/posts/new');
    }
    // Multer
    const temp = {
        image: {
            data: path.join("uploads/" + req.file.filename),
            contentType: req.file.mimetype
        },
    };
    req.body.content = [];
    req.body.content.push(temp);
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
    const posts = await Post.find({ artist: req.user.artistProf?.username });
    res.render('posts/index', { posts, user: req.user, title: 'Tattoo Connect', errorMsg: 'Cannot show all posts.' });
}

async function deletePost(req, res) {
    const post = await Post.findById(req.params.id);
    const user = await User.findOne({ 'artistProf.username': post.artist });
    if (!req.user._id.equals(user._id)) return res.redirect('/');
    fs.unlinkSync(__basedir + `/public/${post.content[0].image.data}`);
    await Post.findByIdAndDelete(req.params.id);
    res.redirect(`/posts`);
}

async function edit(req, res) {
    const postUsername = (await Post.findById(req.params.id)).artist;
    const user = await User.findOne({ 'artistProf.username': postUsername });
    if (!req.user._id.equals(user._id)) return res.redirect('/');
    res.render(`posts/edit`, { id: req.params.id, title: 'Tattoo Connect', errorMsg: 'Cannot edit post' });
}

async function update(req, res) {
    const postUsername = (await Post.findById(req.params.id)).artist;
    const user = await User.findOne({ 'artistProf.username': postUsername });
    if (!req.user._id.equals(user._id)) return res.redirect('/');

    const image = req.file;
    if (!isImg(image?.mimetype)) { // if a file was uploaded and it is not an image
        console.log('You must upload a jpeg or png');
        fs.unlinkSync(__basedir + `/public/uploads/${image.filename}`);
        return res.redirect(`/posts/${req.params.id}/edit`);
    }
    const post = await Post.findById(req.params.id);
    if (req.body.caption) post.caption = req.body.caption;
    if (req.body.tags) post.tags = req.body.tags.split(',').map(t => t.trim())
    if (image) {
        // Multer
        const temp = {
            image: {
                data: path.join("uploads/" + image.filename),
                contentType: image.mimetype
            },
        };
        fs.unlinkSync(__basedir + `/public/${post.content[0].image.data}`);
        post.content = [];
        post.content.push(temp);
    }
    try {
        await post.save();
        res.redirect(`/posts`);
    } catch (err) {
        console.log(err);
        res.redirect(`/posts/${req.params.id}/edit`, { errorMsg: err.message });
    }
}

async function homeFeed(req, res) {
    let posts = await Post.find({});
    if (req.user && req.user.following.length) {
        if (req.user.artistProf) {
            console.log('hre')
            posts = await Post.find({ $and: [{ artist: { $in: req.user.following } }, { artist: { $ne: req.user.artistProf.username } }] })
        }
        else {
            posts = await Post.find({ artist: { $in: req.user.following } });
        }
    }
    res.render('index', { posts, user: req.user, title: 'Tattoo Connect', erorrMsg: 'Cannot show home feed.' });
}

async function like(req, res) {
    const post = await Post.findById(req.params.id);
    if (req.user.likedPosts?.includes(req.params.id)) {
        console.log(req.user.likedPosts, req.params._id);
        req.user.likePosts.splice(req.user.likedPosts.indexOf(req.params.id), 1);
        post.likedBy.splice(post.likedBy.indexOf(req.user._id), 1);
    }
    else {
        req.user.likedPosts.push(req.params.id);
        post.likedBy.push(req.user._id);
    }
    try {
        await req.user.save();
        await post.save();
    } catch (err) {
        console.log(err);
    }
    res.redirect(`back`);
}

async function showLiked(req, res) {
    const posts = await Post.find({ likedBy: req.user._id });
    res.render('posts/liked', { posts, user: req.user, title: 'Tattoo Connect', errorMsg: 'Cannot show liked posts.' });
}

// NOT USING CURRENTLY but might be useful to have the images available as an API?
async function getImg(req, res) {
    let image = (await Post.find({}))[0]?.content[0].image;
    res.contentType(image.mimetype);
    res.send(image.data);
}

function isImg(mimetype) {
    const validImgTypes = ['image/jpeg', 'image/png'];
    return validImgTypes.includes(mimetype);
}

