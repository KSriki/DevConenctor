const express = require('express');
const router = express.Router();

// // @route   GET api/users
// // @desc    Test route
// // @access  Public
// router.get('/', (req, res) => res.send('User Route'));

// create a user. Needs middleware
// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', (req, res) => {
    console.log(req.body);
    res.send('User Route');
});

module.exports = router;