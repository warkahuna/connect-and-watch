const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const ChatMessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    default: uuidv4, // Generate a unique ID for each room
    unique: true,
  },
  creator: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make userId optional
    },
    username: {
      type: String,
      required: true, // Username is required whether authenticated or not
    },
    tempId: {
      type: String,
      unique: true,
      required: false, // Temp ID is required
    },
  },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
      tempId: {
        type: String,
        unique: true,
      },
      status: {
        type: String,
        enum: ["connected", "disconnected"],
        default: "connected",
      },
    },
  ],
  videos: [
    {
      videoUrl: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    },
  ],
  messages: [ChatMessageSchema], // Embedding chat messages within the room
  lastActive: {
    type: Date,
    default: Date.now,
  },
  closed: {
    type: Boolean,
    default: false,
  },
});

RoomSchema.pre("save", function (next) {
  this.lastActive = Date.now();
  next();
});

module.exports = mongoose.model("Room", RoomSchema);
