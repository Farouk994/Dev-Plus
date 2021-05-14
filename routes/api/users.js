const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")

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
  (req, res) => {
    const errors = validationResult(req)
    // This means if there is errors we need a response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    res.send(req.body)
  }
);

// See if User Exists

// Get Users Gravatar

// Encrypt Password

// Return jsonWebToken


module.exports = router
