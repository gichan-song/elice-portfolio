const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user'),
  jwt = require('jsonwebtoken');

const asynchandler = require('express-async-handler');
const timeDiff = require('../utils/time-diff');

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
      date: Date.now(),
    }).then((result) => {
      res.json({ message: 'Post created' });
    });
  });
});

// 오늘 뭐 먹지? API
router.get(
  '/today',
  asynchandler(async (req, res) => {
    const randomPost = await Post.aggregate([
      { $sample: { size: 3 } },
      { $project: { orders: 0, comments: 0, likes: 0 } },
    ]);

    const result = await Post.populate(randomPost, { path: 'user', select: '-scraps -likes -password' });

    res.json(result);
  }),
);
//레시피 전체 목록 조회 API
router.get(
  '/',
  asynchandler(async (req, res) => {
    const countPerPage = parseInt(req.query.countperpage) || 10;
    const pageNo = parseInt(req.query.pageno) || 1;

    const posts = await Post.find({})
      .skip((pageNo - 1) * countPerPage)
      .limit(countPerPage)
      .populate('user')
      .select('-orders')
      .sort({ date: -1 });

    const curr = Date.now() / 1000;

    for (let i = 0; i < posts.length; i++) {
      delete posts[i].user._doc.scraps;
      delete posts[i].user._doc.likes;
      delete posts[i].user._doc.password;
      posts[i]._doc.likesCount = posts[i].likes.length;
      posts[i]._doc.commentsCount = posts[i].comments.length;
      delete posts[i]._doc.likes;
      delete posts[i]._doc.comments;

      const diff = curr - posts[i].date / 1000;
      timeDiff(diff, posts, i);
    }

    res.json(posts);
  }),
);

//로그인한 유저의 전체 레시피 목록 조회 API
router.get('/user', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Login required' });
        return;
      }

      const countPerPage = parseInt(req.query.countperpage) || 10;
      const pageNo = parseInt(req.query.pageno) || 1;

      const posts = await Post.find({})
        .skip((pageNo - 1) * countPerPage)
        .limit(countPerPage)
        .populate('user')
        .select('-orders')
        .sort({ date: -1 });

      const user = await User.findById(authData._id);
      const likes = user.likes;
      const scraps = user.scraps;

      const curr = Date.now() / 1000;

      for (let i = 0; i < posts.length; i++) {
        delete posts[i].user._doc.scraps;
        delete posts[i].user._doc.likes;
        delete posts[i].user._doc.password;
        posts[i]._doc.likesCount = posts[i].likes.length;
        posts[i]._doc.commentsCount = posts[i].comments.length;
        delete posts[i]._doc.likes;
        delete posts[i]._doc.comments;

        const diff = curr - posts[i].date / 1000;

        timeDiff(diff, posts, i);
        if (likes.includes(posts[i]._id)) {
          posts[i]._doc.isLiked = true;
        } else {
          posts[i]._doc.isLiked = false;
        }
        if (scraps.includes(posts[i]._id)) {
          posts[i]._doc.isScrapped = true;
        } else {
          posts[i]._doc.isScrapped = false;
        }
      }

      res.json(posts);
    }),
  );
});

//레시피 검색 조회 API
router.get(
  '/search',
  asynchandler(async (req, res) => {
    const { searchquery } = req.query;
    if (searchquery[0] === '?' || searchquery[0] === '=') {
      res.status(405).json({ message: 'cannot insert query including ? or = at first' });
    }
    const posts = await Post.find({ title: { $regex: searchquery, $options: 'i' } })
      .select('-orders')
      .populate('user');

    const curr = Date.now() / 1000;

    for (let i = 0; i < posts.length; i++) {
      delete posts[i].user._doc.scraps;
      delete posts[i].user._doc.likes;
      delete posts[i].user._doc.password;

      posts[i]._doc.likesCount = posts[i].likes.length;
      posts[i]._doc.commentsCount = posts[i].comments.length;
      delete posts[i]._doc.likes;
      delete posts[i]._doc.comments;

      const diff = curr - posts[i].date / 1000;

      timeDiff(diff, posts, i);
    }
    res.json(posts);
  }),
);

//로그인 한 유저의 레시피 검색 조회 API
router.get('/search/user', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    const { searchquery } = req.query;
    if (searchquery[0] === '?' || searchquery[0] === '=') {
      res.status(405).json({ message: 'cannot insert query including ? or = at first' });
    }
    const posts = await Post.find({ title: { $regex: searchquery, $options: 'i' } })
      .select('-orders')
      .populate('user');

    const curr = Date.now() / 1000;
    const user = await User.findById(authData._id);
    const likes = user.likes;
    const scraps = user.scraps;

    for (let i = 0; i < posts.length; i++) {
      if (likes.includes(posts[i]._id)) {
        posts[i]._doc.isLiked = true;
      } else {
        posts[i]._doc.isLiked = false;
      }
      if (scraps.includes(posts[i]._id)) {
        posts[i]._doc.isScrapped = true;
      } else {
        posts[i]._doc.isScrapped = false;
      }

      delete posts[i].user._doc.scraps;
      delete posts[i].user._doc.likes;
      delete posts[i].user._doc.password;

      posts[i]._doc.likesCount = posts[i].likes.length;
      posts[i]._doc.commentsCount = posts[i].comments.length;
      delete posts[i]._doc.likes;
      delete posts[i]._doc.comments;

      const diff = curr - posts[i].date / 1000;

      timeDiff(diff, posts, i);
    }
    res.json(posts);
  });
});

//카테고리별 레시피 목록 조회 API
router.get(
  '/category',
  asynchandler(async (req, res) => {
    const { category } = req.query;
    const countPerPage = parseInt(req.query.countperpage) || 10;
    const pageNo = parseInt(req.query.pageno) || 1;

    const posts = await Post.find({ category: category })
      .skip((pageNo - 1) * countPerPage)
      .limit(countPerPage)
      .select('-orders')
      .populate('user')
      .sort({ createdAt: -1 });

    const curr = Date.now() / 1000;

    for (let i = 0; i < posts.length; i++) {
      delete posts[i].user._doc.scraps;
      delete posts[i].user._doc.likes;
      delete posts[i].user._doc.password;
      posts[i]._doc.likesCount = posts[i].likes.length;
      posts[i]._doc.commentsCount = posts[i].comments.length;
      delete posts[i]._doc.likes;
      delete posts[i]._doc.comments;

      const diff = curr - posts[i].date / 1000;

      timeDiff(diff, posts, i);
    }

    res.json(posts);
  }),
);

//로그인 한 유저의 레시피 카테고리별 조회 API
router.get('/category/user', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      const { category } = req.query;
      const countPerPage = parseInt(req.query.countperpage) || 10;
      const pageNo = parseInt(req.query.pageno) || 1;

      const posts = await Post.find({ category: category })
        .skip((pageNo - 1) * countPerPage)
        .limit(countPerPage)
        .select('-orders')
        .populate('user')
        .sort({ createdAt: -1 });

      const user = await User.findById(authData._id);
      const likes = user.likes;
      const scraps = user.scraps;
      const curr = Date.now() / 1000;

      for (let i = 0; i < posts.length; i++) {
        delete posts[i].user._doc.scraps;
        delete posts[i].user._doc.likes;
        delete posts[i].user._doc.password;
        posts[i]._doc.likesCount = posts[i].likes.length;
        posts[i]._doc.commentsCount = posts[i].comments.length;
        delete posts[i]._doc.likes;
        delete posts[i]._doc.comments;

        const diff = curr - posts[i].date / 1000;

        timeDiff(diff, posts, i);

        if (likes.includes(posts[i]._id)) {
          posts[i]._doc.isLiked = true;
        } else {
          posts[i]._doc.isLiked = false;
        }
        if (scraps.includes(posts[i]._id)) {
          posts[i]._doc.isScrapped = true;
        } else {
          posts[i]._doc.isScrapped = false;
        }
      }

      res.json(posts);
    }),
  );
});

//레시피 상세 조회 API
router.get('/:postId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret', async (err, authData) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('user');
    const comments = post.comments;
    const user = await User.findById(authData._id);
    const likes = user.likes;
    const scraps = user.scraps;
    const curr = Date.now() / 1000;
    if (comments) {
      for (let i = 0; i < comments.length; i++) {
        const diff = curr - comments[i].date;

        timeDiff(diff, comments, i);
      }
    }

    if (likes.includes(post._id)) {
      post._doc.isLiked = true;
    } else {
      post._doc.isLiked = false;
    }
    if (scraps.includes(post._id)) {
      post._doc.isScrapped = true;
    } else {
      post._doc.isScrapped = false;
    }

    post.comments = comments;

    res.json(post);
  });
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
      user.likes.pull(postId);
    } else {
      post.likes.push({ user: authData._id });
      user.likes.push(postId);
    }

    post.save();
    user.save();

    res.json(user.likes);
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

    const curr = Date.now() / 1000;

    post.comments.push({
      comment: comment,
      date: curr,
      user_id: authData._id,
      userNickname: user.nickname,
      userProfileImg: user.profileImg,
    });

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

    if (comment.user_id !== undefined) {
      if (comment.user_id.toString() !== authData._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
      }
    }

    post.comments.pull(comment._id);
    post.save();
    res.json(`comment ${commentId} deleted`);
  });
});

module.exports = router;
