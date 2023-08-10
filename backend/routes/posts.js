const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user'),
  jwt = require('jsonwebtoken');

const Post = require('../models/Post');

// 레시피 등록 API
router.post('/', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }
    const { recipeIntro, orderInfos } = req.body;
    const user = await User.findById(authData._id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
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
});

//레시피 전체 목록 조회 API
router.get('/', async (req, res) => {
  const countPerPage = parseInt(req.query.countperpage) || 10;
  const pageNo = parseInt(req.query.pageno) || 1;

  const posts = await Post.find({});

  if (pageNo > 0) {
    const totalCount = posts.length;
    let startItemNo = (pageNo - 1) * countPerPage;
    let endItemNo = pageNo * countPerPage - 1;

    if (endItemNo > totalCount - 1) {
      endItemNo = totalCount - 1;
    }
    let postsPageList = [];
    if (startItemNo < totalCount) {
      for (let i = startItemNo; i <= endItemNo; i++) {
        postsPageList.push(posts[i]);
      }
      res.json(postsPageList);
    } else {
      res.json(posts);
    }
  }
});

//레시피 검색 조회 API
router.get('/search', async (req, res) => {
  const { searchquery } = req.query;
  const posts = await Post.find({ title: { $regex: searchquery, $options: 'i' } });
  res.json(posts);
});

//레시피 상세 조회 API
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  res.json(post);
});

//레시피 삭제 API
router.delete('/:postId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.user.toString() !== authData._id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }
    await Post.findByIdAndDelete(postId);
    res.json(`postId: ${postId} deleted`);
  });
});

//레시피 수정 API
router.put('/:postId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post.user.toString() !== authData._id) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }
    const { recipeIntro, orderInfos } = req.body;

    post.thumbnail = recipeIntro.image;
    post.recipe = recipeIntro.content;
    post.title = recipeIntro.title;
    post.category = recipeIntro.category;
    post.orders = orderInfos;

    post.save();
    res.json({ message: 'Post updated' });
  });
});

//좋아요 API
router.post('/:postId/like', verifyToken, (req, res) => {
  const { postId } = req.params;

  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const user = await User.findById(authData._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const like = post.likes.find((like) => like.user.toString() === authData._id.toString());
    if (like) {
      post.likes.pull(like._id);
    } else {
      post.likes.push({ user: authData._id });
    }

    post.save();

    res.json(post.likes);
  });
});

//댓글 작성 API
router.post('/:postId/comments', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }
    const { postId } = req.params;
    const { comment } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const user = await User.findById(authData._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    post.comments.push({ comment: comment, date: Date.now(), user: user });

    post.save();

    res.json(post.comments);
  });
});

//댓글 삭제 API
router.delete('/:postId/comments/:commentId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    if (err) {
      res.status(403).json({ message: 'Login required' });
      return;
    }

    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const user = await User.findById(authData._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const comment = post.comments.find((comment) => comment._id.toString() === commentId.toString());

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.user.toString() !== authData._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    post.comments.pull(comment._id);
    post.save();
    res.json(`comment ${commentId} deleted`);
  });
});

module.exports = router;
