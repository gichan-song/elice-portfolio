const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken');

const User = require('../models/user');

// 회원가입 API
router.post('/signup', (req, res) => {
  const { id, password, nickname } = req.body;

  User.create({ _id: new mongoose.Types.ObjectId(), id, password, nickname });

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
        nickname: user.nickname,
      };

      jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
        res.json({ token: token, accountname: user.id });
      });
    } else {
      res.status(401).json({ message: 'Password is incorrect' });
    }
  }
});

router.get('/login', async (req, res) => {
  const { id, password } = req.body;

  const user = await User.findOne({ id: id }, (err, user) => {});

  res.json(user);
});

module.exports = router;
