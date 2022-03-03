const express = require('express');
const axios = require('axios');
// const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../middleware/checkObjectId');
const cloudinary = require('cloudinary');
const formidable = require('express-formidable');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const {
  getUserProfile,
  createAndUpdateProfile,
  getAllProfiles,
  getProfileById,
  deleteProfile,
  addExperience,
  deleteExperience,
  deleteEducation,
  addEducation,
  getGithubUserName,
  uploadImage
} = require('../controllers/profile');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/profile/me', auth, getUserProfile);

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/profile/new-update',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  // check('image', 'Image is required').notEmpty(),
  createAndUpdateProfile
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/profiles/all', getAllProfiles);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/profile/user/:user_id', checkObjectId('user_id'), getProfileById);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, deleteProfile);

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/profile/experience',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  addExperience
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/profile/experience/:exp_id', auth, deleteExperience);

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/profile/education',
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  addEducation
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/profile/education/:edu_id', auth, deleteEducation);

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', getGithubUserName);

// Upload Image
router.post(
  '/upload-image',
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

module.exports = router;

module.exports = router;
