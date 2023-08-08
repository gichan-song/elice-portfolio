const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const UserSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    profileImg: {
      type: String,
    },
    id: {
      type: String,
    },
    nickname: {
      type: String,
    },
    password: {
      type: String,
    },
    scraps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { collection: 'users' },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
