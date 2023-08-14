const crypto = require('crypto');

module.exports = (password) => {
  return crypto.createHash('sha512').update(password).digest('base64');
};
