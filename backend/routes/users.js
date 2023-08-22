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

    jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
      res.json({ token: token });
    });
  }),
);

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
      const user = await User.findById(authData._id)
        .populate('scraps')
        .populate({ path: 'scraps', populate: { path: 'user' } });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      res.json({
        id: user.id,
        nickname: user.nickname,
        profileImg: user.profileImg,
        scraps: user.scraps,
      });
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
