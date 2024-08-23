const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  createRoom,
  joinRoom,
  closeRoom,
  fetchRoomData,
} = require("../controllers/roomController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// @route   POST /api/rooms/create
// @desc    Create a new room
// @access  Public (but linked to authenticated user if logged in)
router.post(
  "/create",
  [check("username", "Username is required").not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createRoom(req, res);
  }
);

// @route   POST /api/rooms/join
// @desc    Join an existing room
// @access  Public
router.post(
  "/join",
  [
    check("roomId", "Room ID is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    joinRoom(req, res);
  }
);

router.get("/get-room-data/:roomId", async (req, res) => {
  await fetchRoomData(req, res);
});

// @route   POST /api/rooms/close
// @desc    Close a room
// @access  Private (room creator only)
router.post(
  "/close",
  authMiddleware,
  [check("roomId", "Room ID is required").not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    closeRoom(req, res);
  }
);

module.exports = router;
