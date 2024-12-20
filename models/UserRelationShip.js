const mongoose = require("mongoose");

const userRelationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserRelationship = mongoose.model(
  "UserRelationship",
  userRelationshipSchema
);

module.exports = UserRelationship;
