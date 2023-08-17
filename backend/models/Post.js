const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    thumbnail: {
      type: String,
    },
    recipe: {
      type: String,
    },
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      new mongoose.Schema({
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userNickname: String,
        userProfileImg: String,
        comment: String,
        date: String,
      }),
    ],
    likes: [
      new mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      }),
    ],

    orders: [new mongoose.Schema({ id: String, content: String, orderImage: String })],
    date: {
      type: String,
    },
  },

  {
    collection: 'posts',
  },
);
module.exports = mongoose.model('Post', postSchema);
