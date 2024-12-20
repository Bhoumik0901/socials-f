const mongoose = require('mongoose');

// Comment Schema
let commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likesCount: {
    type: Number,
    default: 0
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
