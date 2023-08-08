const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const UserSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    id: {
      type: String,
    },
    nickname: {
      type: String,
    },
    password: {
      type: String,
    },
    profileImg: {
      type: String,
    },
  },
  { collection: 'users' },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
