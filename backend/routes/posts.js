const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user'),
  jwt = require('jsonwebtoken');

const Post = require('../models/Post');

// 레시피 등록
router.post('/', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403);
    } else {
      const { recipeIntro, orderInfos } = req.body;
      const user = await User.findOne({ _id: authData._id });
      if (user) {
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
      }
    }
  });
});

//레시피 전체
router.get('/', async (req, res) => {
  const posts = await Post.find({});

  res.json(posts);
});

//레시피 상세
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  res.json(post);
});

//레시피 삭제
router.delete('/:postId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403);
    }
    const post = await Post.findOne({ user: authData._id });
    if (post) {
      const { postId } = req.params;

      await Post.findByIdAndDelete(postId);
      res.json(`postId: ${postId} deleted`);
    }
  });
});

//레시피 수정
router.put('/:postId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403);
    }
    const post = await Post.findOne({ user: authData._id });
    if (post) {
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
    }
  });
});

//좋아요
router.post('/like/:postId', verifyToken, (req, res) => {
  const { postId } = req.params;

  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403);
    } else {
      const user = await User.findOne({ _id: authData._id });
      const post = await Post.findById(postId);

      const like = post.likes.find((like) => like.user.toString() === user._id.toString());
      if (like) {
        post.likes.pull(like._id);
      } else {
        post.likes.push({ user: user._id });
      }

      post.save();

      res.json(post.likes);
    }
  });
});

module.exports = router;
