const express = require("express");
const router = express.Router();
//validation. adds another parameter to router commands
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
//jwt web token
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   GET api/users
// @desc    Test route
// @access  Public
// router.get('/', (req, res) => res.send('User Route'));

// Get model for mongoose queries
const User = require("../../models/User");

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
  async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if the user exists - respond with error if already exists
      // parameter is email to this just works.
      // wait until we see if email already in use
      let user = await User.findOne({ email });

      if (user) {
        // mirror the validation array so that on the front end everything is consistent
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // get users gravatar based on email
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // create user (doesnt save)
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password using BCrypt. Instead of .then use awaits
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return the jsonwebtoken - user logs in when it is created. need token
      const payload = {
        user: {
          // actually _id in mongoDB but mongoose abstacts this
          id: user.id,
        },
      };

      // jwt secret in config
      // expires to less time in deployment
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
