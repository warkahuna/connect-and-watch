const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret, jwtExpire } = require("../config/jwtConfig");
const Room = require("../models/Room");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        username: user.username, // Include username in the response
        id: user.id, // Include user ID in the response
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Disconnect a user from a room
// @route   POST /api/rooms/disconnect
// @access  Public (but must provide tempId or be authenticated)
exports.disconnectUser = async (req, res) => {
  const { roomId } = req.body;
  let userId = null;
  let tempId = req.headers["x-temp-id"]; // Temporary ID for unauthenticated users

  // Check if the Authorization header is present
  if (req.header("Authorization")) {
    const token = req.header("Authorization").split(" ")[1];
    try {
      const decoded = jwt.verify(token, jwtSecret);
      userId = decoded.user.id;
    } catch (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  }

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Find the participant and update their status to 'disconnected'
    const participant = room.participants.find(
      (p) =>
        (p.userId && p.userId.toString() === userId) ||
        (!p.userId && p.tempId === tempId)
    );

    if (participant) {
      participant.status = "disconnected";
      room.lastActive = Date.now();
      await room.save();

      res.status(200).json({ message: "User disconnected from the room" });
    } else {
      res.status(404).json({ message: "User not found in the room" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
