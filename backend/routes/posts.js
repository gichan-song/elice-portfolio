const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user'),
  jwt = require('jsonwebtoken');

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
    res.json({ message: 'Post created' });
  });
});

router.get('/', async (req, res) => {
  const posts = await Post.find({});

  res.json(posts);
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  res.json(post);
});

router.delete('/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  await Post.findByIdAndDelete(postId);
  res.json({ message: 'Post deleted' });
});

router.put('/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { recipeIntro, orderInfos } = req.body;
  const post = await Post.findOne({ _id: postId });

  post.thumbnail = recipeIntro.image;
  post.recipe = recipeIntro.content;
  post.title = recipeIntro.title;
  post.category = recipeIntro.category;
  post.orders = orderInfos;

  post.save();
  res.json({ message: 'Post updated' });
});

router.put('/like/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const bearerHeader = req.headers['authorization'];
  let userInfo = '';

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, 'secret', (err, authData) => {
      if (err) {
        res.status(403);
      } else {
        userInfo = authData;
      }
    });
  } else {
    res.status(403);
  }

  const user = await User.findOne({ id: userInfo.id });
  const post = await Post.findById(postId);

  const like = post.likes.find((like) => like.user === user._id);
  if (like) {
    like.like = true;
  } else {
    console.log('unlike');
    console.log(user._id);
  }

  post.save();

  res.json(post.likes);
});

module.exports = router;
