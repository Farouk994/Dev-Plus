const express = require("express");
const request = require("request");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { route } = require("./auth");
// const { check, validatorResult } = require("express-validator");

// @route GET api/profile/me
// @ route Private
// Get user profile
router.get("/me", auth, async (req, res) => {
  try {
    // User can access their account with the token and we
    // populate the response with their names and avatar
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"], User);

    // If not profile we get an error that user doesn't exist
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    // Send json file with response(profile)
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST or update user profile
// @route Private
router.post(
  "/",
  [
    auth,
    [
      // Validation of skills and status of user
      check("status", "Status is required").not().isEmpty(),
      check("skills", "skills is required").isEmpty(),
    ],
  ],
  async (req, res) => {
    // When using validation, its good to check for errors and return errors array
    // with the above messages
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // This is obj destructuring that enables MongoDB
    // handle multiple req from the body and update the the profile model which
    // is now linked to the user model
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
      experience,
    } = req.body;

    // Build Profile Obj
    // Whateva the user sends will be stored in this obj that we will be using
    // to update the user profile
    const profileFields = {};
    // get User.id => connect the user input info to the user id
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

    // All user social info will be stored in this same object profilefields = {...{..}}
    // Build Social Obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // Now lets connect to the Mongo Database
    try {
      // This statement is basically saying that findOne User(withToken, userID) and if its
      // that specific users profile, (findOneAndUpdate) with the profilefields obj
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create Profile and save it inside the databse
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error");
    }
    res.send("Profile Created");
  }
);

// @route GET api/users
// @DESC get PROFILE by UserID
// @access Public
// Route for finding all user Profiles
router.get("/", async (req, res) => {
  try {
    const profile = await User.find().populate(
      "user",
      ["name", "avatar"],
      User
    );
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get specific user
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
      // Get User Profile
    }).populate("users", ["name", "avatar"]);
    res.json(profile);
    if (!profile) {
      res.status(400).json({ msg: "Profile Not Found" });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).json({ msg: "Profile Not Found" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route make a delete request
// @desc Delete profile, user $ posts
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // TODO Remove User Posts
    // remove profile
    await Promise.all([
      // Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id }),
    ]);

    res.json({ msg: "User has been Deleted" });
    console.log("User has been deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route appi/profile/experience
// @desc make a PUT request
// @access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is empty").not().isEmpty(),
      check("company", "Company is empty").not().isEmpty(),
      check("from", "From Date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Validate the user input with the validation error var
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get info from the user using obj destructuring
    const { title, company, location, from, to, current, description } =
      req.body;

    // This will create an obj that the user submits
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    // Now we start to deal with MongoDB
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // unshift pushes the new experience at the beginning so that most recent is first
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private

FIXME: router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // Get profile of the logged In User
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index / Map through the array and return id and chain onto it
    // and match the id that we passed in on the experience/:exp_id
    const removeIndex = profile.experience
      .map((item) => {
        item.id;
      })
      .indexOf(req.params.exp_id);

    // Splice takes an experince from the array according to its index and
    // i instructed it to only remove one
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route api/profile/education/

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of Study is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Validate the user input with the validation error var
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get info from the user using obj destructuring
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    // This will create an obj that the user submits
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    // Now we start to deal with MongoDB
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // unshift pushes the new experience at the beginning so that most recent is first
      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private

FIXME: router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // Get profile of the logged In User
    const profile = await Profile.findOne({ user: req.user.id });
    // console.log()

    // Get remove index / Map through the array and return id and chain onto it
    // and match the id that we passed in on the education/:exp_id
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    // Splice takes an education from the array according to its index and
    // i instructed it to only remove one
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/github/:username
// @desc Get User Repos from Github
// @access Private

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
       return res.status(404).json({ msg: "No Github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
