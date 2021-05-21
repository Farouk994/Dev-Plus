const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
// const { check, validatorResult } = require("express-validator");

// @route GET api/users
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate([
      "user",
      "avatar",
    ]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    res.status(400).json("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "skills is required").isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //
    const {
      website,
      skills,
      githubusername,
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin,
      status,
      location,
      company,
      bio,
    } = req.body;

    // Build Profile Obj
    const profileFields = {};
    // get User.id
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // if (skills) {
    //   console.log("eagle");
    //   console.log("Boss");
    //   profileFields.skills = skills
    //     .split(",")
    //     .map((skill) => " " + skill.trim());
    //   console.log(skill);
    // }

    // Build Social Obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile)
      }

      // Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile)
    } catch (err) {
      res.status(500).send("Server Error");
    }
    res.send("Profile Created");
  }
);

module.exports = router;
