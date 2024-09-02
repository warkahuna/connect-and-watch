// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const roomSocket = require("./sockets/roomSocket");
const videoSocket = require("./sockets/videoSocket");
const chatSocket = require("./sockets/chatSocket");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use("/", express.static(__dirname, { etag: true, maxAge: "3d" }));
app.use(express.static(__dirname + "/dist"));

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (customize as needed)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Initialize individual socket modules
  roomSocket(io, socket);
  videoSocket(io, socket);
  chatSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Handle disconnect logic if needed
  });
});

// Basic Route for Testing
/*app.get("/", (req, res) => {
  res.send("Server is running...");
});*/

// Set up routes (import your route files here)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
//app.use("/api/chat", require("./routes/chatRoutes"));

// Error Handling Middleware (you can define this in a separate file if needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
