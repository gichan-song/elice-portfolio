const express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/Post');
const verifyToken = require('../middlewares/verifyToken');
const hashPassword = require('../utils/hash-password').default;
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
        .select('scraps -_id')
        .populate('scraps')
        .populate({ path: 'scraps', populate: { path: 'user' } });

      if (!scraps) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      for (let i = 0; i < scraps.scraps.length; i++) {
        delete scraps.scraps[i]._doc.orders;
        delete scraps.scraps[i]._doc.comments;
        delete scraps.scraps[i]._doc.likes;
      }

      // const copyScraps = [...scraps._doc.scraps];

      // const copyScrapsUser = copyScraps.map((scrap) => {
      //   return scrap.user;
      // });

      // const likesCount = scraps._doc.scraps.map((scrap) => {
      //   return scrap.likes.length;
      // });

      // const commentsCount = scraps._doc.scraps.map((scrap) => {
      //   return scrap.comments.length;
      // });
      // for (let i = 0; i < copyScrapsUser.length; i++) {
      //   delete copyScrapsUser[i]._doc.scraps;
      //   delete copyScrapsUser[i]._doc.likes;
      //   delete copyScrapsUser[i]._doc.password;
      // }
      // for (let i = 0; i < copyScraps.length; i++) {
      //   delete copyScraps[i]._doc.orders;
      //   delete copyScraps[i]._doc.comments;
      //   delete copyScraps[i]._doc.likes;

      //   copyScraps[i]._doc.user = copyScrapsUser[i];
      //   copyScraps[i]._doc.likesCount = likesCount[i];
      //   copyScraps[i]._doc.commentsCount = commentsCount[i];
      // }

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
