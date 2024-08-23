const Room = require("../models/Room"); // Assuming you have a Room model

module.exports = (io, socket) => {
  socket.on("videoAdded", async (data) => {
    const { roomId, videoUrl, userId, tempId, type, username } = data;

    let videoPath;
    if (type === "upload") {
      videoPath = videoUrl; // In this case, videoUrl would be the file URL
    } else if (type === "youtube" || type === "direct") {
      videoPath = videoUrl;
    } else {
      socket.emit("error", { message: "Invalid video type" });
      return;
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    const userUploader = room.participants.find(
      (el) => el.username === username
    );

    const uploader = userUploader?._id;

    const video = {
      videoUrl: videoPath,
      uploadedBy: uploader,
      uploadedAt: Date.now(),
      type: type,
    };

    room.videos.push(video);
    await room.save();

    const addedVideo = room.videos[room.videos.length - 1];

    io.to(roomId).emit("videoAdded", {
      roomId,
      videoUrl: videoPath,
      videoId: addedVideo._id,
      type: type,
      uploadedBy: uploader,
    });
  });

  socket.on("playVideo", (data) => {
    console.log("playVideo", data);

    io.to(data.roomId).emit("playVideo", data);
  });

  socket.on("pauseVideo", (data) => {
    console.log("pauseVideo", data);

    io.to(data.roomId).emit("pauseVideo", data);
  });

  socket.on("seekVideo", (data) => {
    io.to(data.roomId).emit("seekVideo", data);
  });

  socket.on("deleteVideo", async ({ roomId, videoId, userId }) => {
    const room = await Room.findOne({ roomId });
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // Check if the user is the creator
    if (room.creator.userId !== userId) {
      socket.emit("error", {
        message: "Only the room creator can delete videos",
      });
      return;
    }

    room.videos = room.videos.filter(
      (video) => video._id.toString() !== videoId
    );
    await room.save();

    io.to(roomId).emit("videoDeleted", { videoId });
  });
};
