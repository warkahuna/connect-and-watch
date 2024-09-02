const Room = require("../models/Room");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

// @route   POST /api/videos/:roomId/upload
// @desc    Upload a video to a room
// @access  Private (room creator only)
exports.uploadVideo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, tempId, videoUrl, type, username } = req.body; // Include videoUrl and type in the body

    // Determine the video path based on the type
    let videoPath;
    if (type === "upload") {
      videoPath = req.file
        ? `${process.env.STORAGE_URL}/uploads/videos/${req.file.filename}`
        : null;
      if (!videoPath) {
        return res.status(400).json({ message: "Video file is missing" });
      }
    } else if (type === "youtube" || type === "direct") {
      videoPath = videoUrl;
      if (!videoPath) {
        return res.status(400).json({ message: "Video URL is missing" });
      }
    } else {
      return res.status(400).json({ message: "Invalid video type" });
    }

    if (!roomId || (!userId && !tempId) || !videoPath) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const userUploader = room.participants.find(
      (el) => el.username === username
    );

    const uploader = userUploader?._id;
    const video = {
      videoUrl: videoPath,
      uploadedBy: uploader,
      uploadedAt: Date.now(),
      type: type, // Include the type of the video
    };

    room.videos.push(video);
    await room.save();
    const addedVideo = room.videos[room.videos.length - 1];
    console.log(addedVideo);

    res.status(200).json({
      message: "Video uploaded successfully",
      videoId: addedVideo._id,
      video: addedVideo,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// List all videos in a room
exports.listVideos = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room.videos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete file: ${filePath}`, err);
    else console.log(`Deleted file: ${filePath}`);
  });
};

// Delete a video from a room and storage
exports.deleteVideo = async (req, res) => {
  const { roomId, videoId } = req.params;
  const userId = req.user ? req.user.id : null;
  const tempId = req.headers["x-temp-id"];

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
        .json({ message: "You are not authorized to delete this video" });
    }

    // Find the video to delete
    const video = room.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // If the video is a locally uploaded file, delete it from storage
    if (video.videoUrl.startsWith("/uploads/videos/")) {
      const filePath = path.join(__dirname, "..", video.videoUrl);
      deleteFile(filePath);
    }

    // Remove the video from the room's videos array
    room.videos = room.videos.filter((v) => v._id.toString() !== videoId);
    await room.save();
    io.to(roomId).emit("videoDeleted", { videoId });
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
