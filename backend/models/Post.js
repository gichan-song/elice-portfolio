const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
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
    orders: [new mongoose.Schema({ id: String, content: String, orderImage: String })],
  },

  {
    collection: 'posts',
  },
);
module.exports = mongoose.model('Post', postSchema);
