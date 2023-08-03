const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, 'secret', (err, authData) => {
      if (err) {
        res.status(403);
      } else {
        res.json({
          message: 'User authenticated...',
          authData,
        });
        next();
      }
    });
  } else {
    res.status(403);
  }
};
