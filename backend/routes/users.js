const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/Post');
const verifyToken = require('../middlewares/verifyToken');
const hashPassword = require('../utils/hash-password');
const asynchandler = require('express-async-handler');

// 회원가입 API
router.post('/signup', (req, res) => {
  const { id, password, nickname, profileImg } = req.body;
  const hashedPassword = hashPassword(password);

  User.create({ _id: new mongoose.Types.ObjectId(), id, password: hashedPassword, nickname, profileImg });

  res.json({ message: 'User created' });
});

// 이메일 중복확인 API
router.post(
  '/validate/id/:id',
  asynchandler(async (req, res) => {
    const { id } = req.params;

    if (await User.exists({ id })) {
      res.status(409).json({ message: 'Id exists' });
      return;
    }
    res.json({ message: 'Id available' });
  }),
);

//닉네임 중복확인 API
router.post(
  '/validate/nickname/:nickname',
  asynchandler(async (req, res) => {
    const { nickname } = req.params;

    if (await User.exists({ nickname })) {
      res.status(409).json({ message: 'Nickname exists' });
      return;
    }
    res.json({ message: 'Nickname available' });
  }),
);

//로그인 API
router.post(
  '/login',
  asynchandler(async (req, res) => {
    const { id, password } = req.body;
    const user = await User.findOne({ id: id });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (user.password !== hashPassword(password)) {
      res.status(401).json({ message: 'Password is incorrect' });
      return;
    }
    const payload = {
      _id: user._id,
    };

    jwt.sign(payload, 'secret', { expiresIn: '365d' }, (err, token) => {
      res.json({ token: token });
    });
  }),
);

// 스크랩 조회 API
router.get('/profile/scraps', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Login required' });
        return;
      }
      const scraps = await User.findById(authData._id)
        .select('scraps likes')
        .populate('scraps')
        .populate({ path: 'scraps', populate: { path: 'user' } });

      if (!scraps) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const likes = scraps.likes;

      const curr = Date.now() / 1000;

      for (let i = 0; i < scraps.scraps.length; i++) {
        if (likes.includes(scraps.scraps[i]._id)) {
          scraps.scraps[i]._doc.isLiked = true;
        } else {
          scraps.scraps[i]._doc.isLiked = false;
        }
        scraps.scraps[i]._doc.isScrapped = true;

        delete scraps.scraps[i]._doc.orders;
        delete scraps.scraps[i].user._doc.scraps;
        delete scraps.scraps[i].user._doc.likes;
        delete scraps.scraps[i].user._doc.password;

        scraps.scraps[i]._doc.likesCount = scraps.scraps[i].likes.length;
        scraps.scraps[i]._doc.commentsCount = scraps.scraps[i].comments.length;
        delete scraps.scraps[i]._doc.likes;
        delete scraps.scraps[i]._doc.comments;

        const diff = curr - scraps.scraps[i].date / 1000;

        if (diff < 60) {
          scraps.scraps[i].date = `${Math.floor(diff)}초 전`;
        } else if (diff < 3600) {
          scraps.scraps[i].date = `${Math.floor(diff / 60)}분 전`;
        } else if (diff < 86400) {
          scraps.scraps[i].date = `${Math.floor(diff / 3600)}시간 전`;
        } else if (diff < 604800) {
          scraps.scraps[i].date = `${Math.floor(diff / 86400)}일 전`;
        } else if (diff < 2592000) {
          scraps.scraps[i].date = `${Math.floor(diff / 604800)}주 전`;
        } else if (diff < 31536000) {
          scraps.scraps[i].date = `${Math.floor(diff / 2592000)}달 전`;
        } else {
          scraps.scraps[i].date = `${Math.floor(diff / 31536000)}년 전`;
        }
      }

      res.json(scraps.scraps);
    }),
  );
});

// 프로필 조회 API
router.get('/profile', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Login required' });
        return;
      }
      const user = await User.findById(authData._id).select('-scraps -password -likes');

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    }),
  );
});

// 유저 검색 및 조회 API
router.get(
  '/search',
  asynchandler(async (req, res) => {
    const { nickname } = req.query;

    const users = await User.find({ nickname: { $regex: nickname } });

    res.json({
      users: users.map((user) => ({
        id: user.id,
        nickname: user.nickname,
        profileImg: user.profileImg,
      })),
    });
  }),
);

// 프로필 수정 API
router.put('/profile', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Login required' });
        return;
      }

      const { nickname, profileImg, currentpassword, changedpassword } = req.body;

      const user = await User.findById(authData._id);

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      if (hashPassword(currentpassword) !== user.password) {
        res.status(401).json({ message: 'Password is incorrect' });
        return;
      }
      user.nickname = nickname;
      user.profileImg = profileImg;

      if (changedpassword !== '' && changedpassword !== undefined) {
        user.password = hashPassword(changedpassword);
      }

      user.save();

      res.json({
        id: user.id,
        nickname: user.nickname,
        profileImg: user.profileImg,
      });
      const posts = await Post.find({});
      for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < posts[i].comments.length; j++) {
          if (posts[i].comments[j].user_id.equals(user._id)) {
            posts[i].comments[j].userNickname = nickname;
            posts[i].comments[j].userProfileImg = profileImg;
          }
        }
        posts[i].save();
      }
    }),
  );
});

// 스크랩 API
router.post('/:postId', verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    'secret',
    asynchandler(async (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Login required' });
        return;
      }

      const { postId } = req.params;

      const user = await User.findById(authData._id);

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const post = await Post.findById(postId);

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      const scraps = user.scraps;
      let flag = false;

      for (let i = 0; i < scraps.length; i++) {
        if (scraps[i].toString() === postId) {
          user.scraps.pull(postId);
          flag = true;
          break;
        }
      }

      if (!flag) {
        user.scraps.push(postId);
      }

      user.save();

      res.json(user.scraps);
    }),
  );
});

module.exports = router;
