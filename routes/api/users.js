const express = require("express");
const router = express.Router();
//validation. adds another parameter to router commands
const { check, validationResult } = require("express-validator");

// // @route   GET api/users
// // @desc    Test route
// // @access  Public
// router.get('/', (req, res) => res.send('User Route'));

// create a user. Needs middleware
// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    res.send("User Route");
  }
);

module.exports = router;
