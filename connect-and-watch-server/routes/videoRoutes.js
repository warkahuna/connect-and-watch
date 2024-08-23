const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  uploadVideo,
  listVideos,
  deleteVideo,
} = require("../controllers/videoController");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/videos/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to upload a video (authenticated users only)
router.post(
  "/:roomId/upload",
  authMiddleware,
  upload.single("videoFile"), // Handle file upload
  async (req, res) => {
    const uploader = req.user ? req.user.id : req.headers["x-temp-id"];
    req.body.uploader = uploader; // Add uploader information to req.body
    await uploadVideo(req, res); // Pass req and res directly to the controller
  }
);

// Route to list all videos in a room
router.get("/:roomId/videos", async (req, res) => {
  await listVideos(req, res);
});

// Route to delete a video (room creator only)
router.delete("/:roomId/videos/:videoId", authMiddleware, async (req, res) => {
  await deleteVideo(req, res);
});

module.exports = router;
