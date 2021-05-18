const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");

// @route GET api/users
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate([
      "user",
      "avatar",
    ]);
    if(!profile){
        return res.status(400).json({ msg : "There is no profile for this user"})
    }
  } catch (err) {
      res.status(400).json("Server Error")
  }
});

module.exports = router;
