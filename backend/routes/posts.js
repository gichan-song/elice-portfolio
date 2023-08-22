const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  verifyToken = require('../middlewares/verifyToken'),
  User = require('../models/user'),
  jwt = require('jsonwebtoken');

const asynchandler = require('express-async-handler');
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

//레시피 전체 목록 조회 API
router.get(
  '/',
  asynchandler(async (req, res) => {
    const countPerPage = parseInt(req.query.countperpage) || 10;
    const pageNo = parseInt(req.query.pageno) || 1;

    const posts = await Post.find({}).populate('user').sort({ date: -1 });
    const curr = Date.now() / 1000;

    for (let i = 0; i < posts.length; i++) {
      const diff = curr - posts[i].date / 1000;

      if (diff < 60) {
        posts[i].date = `${Math.floor(diff)}초 전`;
      } else if (diff < 3600) {
        posts[i].date = `${Math.floor(diff / 60)}분 전`;
      } else if (diff < 86400) {
        posts[i].date = `${Math.floor(diff / 3600)}시간 전`;
      } else if (diff < 604800) {
        posts[i].date = `${Math.floor(diff / 86400)}일 전`;
      } else if (diff < 2592000) {
        posts[i].date = `${Math.floor(diff / 604800)}주 전`;
      } else if (diff < 31536000) {
        posts[i].date = `${Math.floor(diff / 2592000)}달 전`;
      } else {
        posts[i].date = `${Math.floor(diff / 31536000)}년 전`;
      }
    }

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
        res.json(posts, totalCount);
      }
    }
  }),
);

//로그인한 유저의 전체 레시피 목록 조회 API
router.get(
  '/user/:userId',
  asynchandler(async (req, res) => {
    const countPerPage = parseInt(req.query.countperpage) || 10;
    const pageNo = parseInt(req.query.pageno) || 1;

    const posts = await Post.find({}).populate('user').sort({ date: -1 });
    const curr = Date.now() / 1000;

    for (let i = 0; i < posts.length; i++) {
      const diff = curr - posts[i].date / 1000;

      if (diff < 60) {
        posts[i].date = `${Math.floor(diff)}초 전`;
      } else if (diff < 3600) {
        posts[i].date = `${Math.floor(diff / 60)}분 전`;
      } else if (diff < 86400) {
        posts[i].date = `${Math.floor(diff / 3600)}시간 전`;
      } else if (diff < 604800) {
        posts[i].date = `${Math.floor(diff / 86400)}일 전`;
      } else if (diff < 2592000) {
        posts[i].date = `${Math.floor(diff / 604800)}주 전`;
      } else if (diff < 31536000) {
        posts[i].date = `${Math.floor(diff / 2592000)}달 전`;
      } else {
        posts[i].date = `${Math.floor(diff / 31536000)}년 전`;
      }
    }

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
  }),
);

//레시피 검색 조회 API
router.get(
  '/search',
  asynchandler(async (req, res) => {
    const { searchquery } = req.query;
    if (searchquery[0] === '?' || searchquery[0] === '=') {
      res.status(405).json({ message: 'cannot insert query including ? or = at first' });
    }
    const posts = await Post.find({ title: { $regex: searchquery, $options: 'i' } });
    res.json(posts);
  }),
);

//레시피 카테고리별 조회 API
router.get(
  '/category',
  asynchandler(async (req, res) => {
    const { category } = req.query;
    const countPerPage = parseInt(req.query.countperpage) || 10;
    const pageNo = parseInt(req.query.pageno) || 1;

    const posts = await Post.find({ category: category }).populate('user').sort({ createdAt: -1 });

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
  }),
);

//레시피 상세 조회 API
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate('user');
  const comments = post.comments;
  const curr = Date.now() / 1000;
  for (let i = 0; i < comments.length; i++) {
    const diff = curr - comments[i].date;

    if (diff < 60) {
      comments[i].date = `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
      comments[i].date = `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
      comments[i].date = `${Math.floor(diff / 3600)}시간 전`;
    } else if (diff < 604800) {
      comments[i].date = `${Math.floor(diff / 86400)}일 전`;
    } else if (diff < 2592000) {
      comments[i].date = `${Math.floor(diff / 604800)}주 전`;
    } else if (diff < 31536000) {
      comments[i].date = `${Math.floor(diff / 2592000)}달 전`;
    } else {
      comments[i].date = `${Math.floor(diff / 31536000)}년 전`;
    }
  }
  post.comments = comments;
  console.log(post);
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
      user.likes.pull(postId);
    } else {
      post.likes.push({ user: authData._id });
      user.likes.push(postId);
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
