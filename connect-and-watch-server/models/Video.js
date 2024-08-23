const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const VideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["youtube", "direct", "upload"],
    required: true,
  },
});

module.exports = mongoose.model("Video", VideoSchema);
