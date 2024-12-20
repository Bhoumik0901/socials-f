const express = require("express");
const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");
const router = express.Router();
router.post("/comment", async (req, res) => {
  const { postId, username, text } = req.body;
  // const {userId}=req.params;
  console.log(req.body)
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const newComment = new Comment({
      postId,
      username,
      text,
    });
    post.comments=[...post.comments, newComment];
    console.log(post.comments)
    await post.save();

    await newComment.save();
    res.status(201).json({newComment});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports=router;

