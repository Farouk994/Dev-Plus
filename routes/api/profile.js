const express = require("express");
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
      experience
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

// @route GET specific user
// @route /user/:user_id
// @route Public
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
// @route make a PUT request
// @access Private

router.put("/experience", [auth, [
   check("title","Title is empty").not().isEmpty(),
   check("company","Company is empty").not().isEmpty()
]], async (req, res) => {
  // Validate the user input with the validation error var
  const errors  = validationResult(req);
  if(!errors.isEmpty){
    return res.status(400).json({errors : errors.array()});
  }

  // Get info from the user using obj destructuring
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  // This will create an obj that the user submits
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  // Now we start to deal with MongoDB
  try{
   const profile = await Profile.findOne({ user : req.user.id });

   // unshift pushes the new experience at the beginning so that most recent is first
   profile.experience.unshift(newExp);

   await profile.save();

   res.json(profile)
  }catch(err){
      console.log(err.message);
      res.status(500).send('Server Error')
  }
});

module.exports = router;
