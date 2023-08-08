const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/Post');

// 회원가입 API
router.post('/signup', (req, res) => {
  const { id, password, nickname, profileImg } = req.body;

  User.create({ _id: new mongoose.Types.ObjectId(), id, password, nickname, profileImg });

  res.json({ message: 'User created' });
});

// 이메일 중복확인 API
router.post('/validate/id/:id', async (req, res) => {
  const { id } = req.params;

  if (await User.exists({ id })) {
    res.status(409).json({ message: 'Id exists' });
  } else {
    res.json({ message: 'Id available' });
  }
});

//닉네임 중복확인 API
router.post('/validate/nickname/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (await User.exists({ nickname })) {
    res.status(409).json({ message: 'Nickname exists' });
  } else {
    res.json({ message: 'Nickname available' });
  }
});

//로그인 API
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const user = await User.findOne({ id: id });

  if (!user) {
    res.status(401).json({ message: 'User not found' });
  } else {
    if (user.password === password) {
      const payload = {
        _id: user._id,
        id: user.id,
        password: user.password,
        nickname: user.nickname,
      };

      jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
        res.json({ token: token });
      });
    } else {
      res.status(401).json({ message: 'Password is incorrect' });
    }
  }
});

router.post('/scrap/:postId', async (req, res) => {
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

  if (user.scraps.includes(postId)) {
    user.scraps.pull(postId);
  } else {
    user.scraps.push(postId);
  }

  res.json(user.scraps);
});

module.exports = router;
