const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user');

const Post = require('../models/Post');

router.post('/', verifyToken, async (req, res) => {
  const { recipeIntro, orderInfos, accountname } = req.body;
  const user = await User.findOne({ id: accountname });

  Post.create({
    _id: new mongoose.Types.ObjectId(),
    thumbnail: recipeIntro.image,
    recipe: recipeIntro.content,
    title: recipeIntro.title,
    category: recipeIntro.category,
    orders: orderInfos,
    user: user,
  }).then((result) => {
    console.log('post created');
  });
});

router.get('/', async (req, res) => {
  const posts = await Post.find({}, (err, posts) => {});

  res.json(posts);
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId }, (err, post) => {});
  res.json(post);
});

router.delete('/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  await Post.deleteOne({ _id: postId }, (err, post) => {});
});

module.exports = router;
