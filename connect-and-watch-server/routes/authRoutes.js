const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  registerUser,
  loginUser,
  disconnectUser,
} = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await registerUser(req, res);
  }
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await loginUser(req, res);
  }
);

// @route   POST /api/rooms/disconnect
// @desc    Disconnect a user from a room
// @access  Public (must provide tempId or be authenticated)
router.post(
  "/disconnect",
  [check("roomId", "Room ID is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await disconnectUser(req, res);
  }
);

module.exports = router;
