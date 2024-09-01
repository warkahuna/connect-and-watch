const Room = require("../models/Room");

module.exports = (io, socket) => {
  socket.on("videoAdded", async (data) => {
    const { roomId, videoUrl, userId, tempId, type, username } = data;

    let videoPath;
    if (type === "upload") {
      videoPath = videoUrl;
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

    if (videoUrl.length > 0) {
      room.videos.push(video);
      await room.save();
    }

    const addedVideo = room.videos[room.videos.length - 1];
    console.log(data);

    io.to(roomId).emit("videoAdded", {
      roomId,
      videoUrl: videoPath,
      videoId: addedVideo._id,
      type: type,
      uploadedBy: uploader,
      videosList: room.videos,
    });
  });

  // Handle when a video from the queue is selected to play
  socket.on("playQueueVideo", (data) => {
    const { roomId, videoUrl, time, videoId, type } = data;

    console.log("playQueueVideo", data);
    io.to(roomId).emit("videoAdded", {
      roomId,
      videoUrl: videoUrl,
      videoId: videoId,
      type: type,
      //uploadedBy: uploader,
    });

    // Emit playQueueVideo event to all clients in the room to play the selected video
    io.to(roomId).emit("playQueueVideo", { roomId, videoUrl, time });
  });

  // Handle when a video gets added to queue
  socket.on("addToQueue", async (data) => {
    const { roomId, videoUrl, time, videoId, type, username } = data;
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
      videoUrl: videoUrl,
      uploadedBy: uploader,
      uploadedAt: Date.now(),
      type: type,
    };
    if (videoUrl.length > 0) {
      room.videos.push(video);
      await room.save();
    }
    const addedVideo = room.videos[room.videos.length - 1];

    console.log("addToQueue", data);
    io.to(roomId).emit("addToQueue", {
      roomId,
      videoUrl: videoUrl,
      videoId: addedVideo._id,
      type: type,
      videosList: room.videos,
      //uploadedBy: uploader,
    });
  });

  socket.on("playVideo", (data) => {
    console.log("playVideo", data);

    // Emit play only if the video is currently paused
    io.to(data.roomId).emit("playVideo", data);
  });

  socket.on("pauseVideo", (data) => {
    console.log("pauseVideo", data);

    // Emit pause only if the video is currently playing
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
