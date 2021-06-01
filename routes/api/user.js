const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// Require User Model to be used for connecting routes to specific user created
const User = require("../../models/User");
router.post(
  "/",
  // Validate User First
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please enter valid Email").isEmail(),
    check("password", "Enter atleast 6 or more Characters").isLength({
      min: 6,
    }),
  ],
  // I will be using (async) functions since i am going to be making requests
  // from the database on different occassions like

  // @ Validating the user
  // @ Checking to see if User is already registered
  // @ Using Gravatar to create user profile images
  // @ Hashing Passwords using bcryptjs for security measures
  // @ Using JWT to create a token for every user created or registered

  async (req, res) => {
    const errors = validationResult(req);
    // This means if there is errors we need a response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // See if User Exists

    // This var will be checking the input of the user but most especially email
    let { name, email, password } = req.body;
    try {
      // finding user by email before another new user is created with the same details
      let user = await User.findOne({ email });

      // Returning a message to new user if same email is used to registe for new account
      if (user) {
        return res
          .status(400)
          .send({ errors: [{ msg: "User Already Exists!!" }] });
      }
      // Get Users Gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // If user email or user doesnt exist then we can create a new one using the User model
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log(user);

      // jsonWebToken enable us create a token after the new User is created form the user id
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "9900000000" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // Incase our request doesnt go through, we will be catching errors
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
