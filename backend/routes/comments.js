const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  User = require('../models/user');

const verifyToken = require('../middlewares/verifyToken');
const Post = require('../models/Post');

router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
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

  post.comments.push({ comment: comment, date: Date.now(), user: user._id });
  post.save();

  res.json(post.comments);
});

router.delete('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params;
  await Post.findOneAndUpdate({ 'comments._id': commentId }, { $pull: { comments: { _id: commentId } } });
  res.json({ message: 'Comment deleted' });
});

module.exports = router;
