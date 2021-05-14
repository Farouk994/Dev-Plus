const express = require("express");
const router = express.Router();

// @route GET api/users
router.post("/",(req,res)=>{
    res.send('Post Route')
});

module.exports = router;