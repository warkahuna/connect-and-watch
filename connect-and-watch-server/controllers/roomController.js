const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwtConfig");
const path = require("path");
const fs = require("fs");

// @desc    Create a new room
// @route   POST /api/rooms/create
// @access  Public (but linked to authenticated user if logged in)
exports.createRoom = async (req, res) => {
  const { username, userId } = req.body;
  const isAuthenticated = !!userId; // Determine if the user is authenticated

  try {
    const tempId = isAuthenticated ? null : uuidv4(); // Generate a unique ID for the session if unauthenticated

    const creator = {
      userId: isAuthenticated ? userId : null, // Store userId if authenticated, otherwise null
      username,
      ...(tempId && { tempId }), // Only include tempId if it's not null
    };

    const room = new Room({
      creator,
      participants: [creator],
    });

    await room.save();
    res.status(201).json({ roomId: room.roomId, tempId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Join an existing room
// @route   POST /api/rooms/join
// @access  Public
exports.joinRoom = async (req, res) => {
  const { roomId, username } = req.body;
  const userId = req.user ? req.user.id : null;

  try {
    const room = await Room.findOne({ roomId });

    if (!room || room.closed) {
      return res.status(404).json({ message: "Room not found or closed" });
    }

    let tempId = uuidv4();
    let participant = room.participants.find(
      (p) =>
        (p.userId && p.userId.toString() === userId) ||
        (!p.userId && p.username === username)
    );

    if (participant) {
      participant.status = "connected";
    } else {
      while (room.participants.find((p) => p.tempId === tempId)) {
        tempId = uuidv4();
      }
      room.participants.push({ userId, username, tempId, status: "connected" });
    }

    room.lastActive = Date.now();
    await room.save();

    res.status(200).json({ roomId: room.roomId, tempId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.fetchRoomData = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ roomId }).populate("videos");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({
      room: {
        id: room._id,
        name: room.name,
        participants: room.participants,
      },
      videos: room.videos,
      chatHistory: [],
    });
  } catch (error) {
    console.error("Error fetching room data:", error);
    res.status(500).json({ message: "Failed to fetch room data" });
  }
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete file: ${filePath}`, err);
    else console.log(`Deleted file: ${filePath}`);
  });
};
// @desc    Close a room
// @route   POST /api/rooms/close
// @access  Private (room creator only)
exports.closeRoom = async (req, res) => {
  const { roomId } = req.body;
  let userId = null;
  let tempId = req.headers["x-temp-id"];

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

    const isCreator = room.creator.userId
      ? room.creator.userId.toString() === userId
      : room.creator.tempId === tempId;

    if (!isCreator) {
      return res
        .status(403)
        .json({ message: "You are not authorized to close this room" });
    }

    // Delete all video files associated with this room
    room.videos.forEach((video) => {
      console.log(video);

      if (video.videoUrl.startsWith("/uploads/videos/")) {
        const filePath = path.join(__dirname, "..", video.videoUrl);
        deleteFile(filePath);
      }
    });

    // Close the room
    room.closed = true;
    await room.save();
    io.to(roomId).emit("roomClosed", {
      message: "Room has been closed by the creator",
    });
    io.socketsLeave(roomId);
    res
      .status(200)
      .json({ message: "Room closed and videos deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route   POST /api/rooms/:roomId/removeUser
// @desc    Remove a user from the room (admin only)
// @access  Private
exports.removeUser = async (req, res) => {
  const { roomId } = req.params;
  const { targetUserId } = req.body; // Either targetUserId or targetTempId will be provided
  const userId = req.user.id;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the user is the creator
    if (room.creator.userId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to remove users from this room",
      });
    }

    // Remove the user (authenticated or unauthenticated)
    if (targetUserId) {
      room.participants = room.participants.filter(
        (u) => u.userId !== targetUserId
      );
    } else if (targetTempId) {
      room.participants = room.participants.filter(
        (u) => u.tempId !== targetTempId
      );
    } else {
      return res
        .status(400)
        .json({ message: "No valid user identifier provided" });
    }

    await room.save();

    io.to(roomId).emit("userRemoved", { userId: targetUserId || targetTempId });
    io.to(targetUserId || targetTempId).emit("removedFromRoom", { roomId });

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
