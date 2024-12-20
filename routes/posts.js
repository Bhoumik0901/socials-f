const express = require("express");
const Post = require("../models/Post");
const { validateToken } = require("../middleware/auth");
const User = require("../models/User");
const Comment = require("../models/Comment");
const router = express.Router();

router.get("/post/:postId", validateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Fetch comments for the specific post
    const comments = await Comment.find({ postId: post._id });

    // Send the post and associated comments
    res.status(201).json({ post, comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/post", validateToken, async (req, res) => {
  let { search } = req.query.search;
  let data = [];
  try {
    data = await Post.find().populate("comments").lean();
  } catch (e) {
    console.log(e);
  }

  res.send({ data });
});
// Create a new Post
router.post("/post", async (req, res) => {
  const { image, description, userId, username } = req.body;
  try {
    const newPost = new Post({
      image,
      description,
      username,
    });

    await newPost.save();
    let user = await User.findById(userId);
    user.yourPosts = [...user.yourPosts, newPost];
    await user.save();
    res.status(201).json({ newPost });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Update a Post
router.put("/post/:postId",async (req, res) => {
  const { image, description, username } = req.body;
  console.log(req.body)
  try {
    console.log(req.params.postId)
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    post.image = image || post.image;
    post.description = description || post.description;
    post.username = username || post.username;

    await post.save();
    res.status(200).json({post});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Delete a Post and its associated Comments
router.delete("/post/:postId", async (req, res) => {
  try {
    const { userId } = req.query;
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // Deletethat post from user List
    let user = await User.findById(userId);
    user.yourPosts = user.yourPosts.filter(
      (post) => post._id !== req.params.postId
    );
    await user.save();

    res.status(200).json({ msg: "Post and associated comments removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/post/:postId/like", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;
  const post = await Post.findByIdAndUpdate(
    postId, // The ID of the post you want to update
    { $inc: { likesCount: 1 } }, // Increment the likesCount by 1
    { new: true } // This option returns the updated document
  );
  const user = await User.findByIdAndUpdate(
    userId, // ID of the user to update
    { $addToSet: { likedPosts: postId } }, // Add postId to likedPosts array (avoids duplicates)
    { new: true } // Return the updated user document
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Send success response with the updated post and user
  res.status(200).json({ message: "Successfully removed like", post, user });
});
router.put("/post/:postId/dislike", async (req, res) => {
  const { postId } = req.params; // Get postId from the URL parameters
  const { userId } = req.query; // Get userId from the query parameters

  try {
    // Update the post's likesCount by decrementing it
    const post = await Post.findByIdAndUpdate(
      postId, // The ID of the post you want to update
      { $inc: { likesCount: -1 } }, // Decrement the likesCount by 1
      { new: true } // This option returns the updated document
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log(post);
    // Update the user's likedPosts array to remove the postId
    const user = await User.findByIdAndUpdate(
      userId, // ID of the user to update
      { $pull: { likedPosts: postId } }, // Remove postId from likedPosts array
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send success response with the updated post and user
    res.status(200).json({ message: "Successfully removed like", post, user });
  } catch (error) {
    // Catch any error and send a 500 status with the error message
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error while disliking the post",
        error: error.message,
      });
  }
});

module.exports = router;
