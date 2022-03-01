const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// const Post = require('../../models/Post');
// const User = require('../../models/User');
const checkObjectId = require('../middleware/checkObjectId');
const {
  likePost,
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  unLikePost,
  commentPost,
  deleteComment
} = require('../controllers/posts');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/posts/new',
  auth,
  check('text', 'Text is required').notEmpty(),
  createPost
);

// @route    GET api/posts/all
// @desc     Get all posts
// @access   Private
router.get('/posts/all', auth, getAllPosts);

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/posts/:id', auth, checkObjectId('id'), getPostById);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/posts/:id', auth, checkObjectId('id'), deletePost);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/posts/like/:id', auth, checkObjectId('id'), likePost);

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/posts/unlike/:id', auth, checkObjectId('id'), unLikePost);

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/posts/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  commentPost
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/posts/comment/:id/:comment_id', auth, deleteComment);

module.exports = router;
