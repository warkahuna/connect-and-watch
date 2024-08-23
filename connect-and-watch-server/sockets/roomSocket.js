const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

module.exports = (io, socket) => {
  socket.on("joinRoom", async ({ roomId, user }) => {
    try {
      socket.join(roomId);
      console.log(`${user.username} joined room: ${roomId}`);

      const room = await Room.findOne({ roomId });
      if (!room || room.closed) {
        socket.emit("error", { message: "Room not found or closed" });
        return;
      }

      // Check if the user is already in the room
      let participant = room.participants.find(
        (p) =>
          (p.userId && p.userId.toString() === user.userId) ||
          (!p.userId && p.username === user.username)
      );

      if (participant) {
        // If the user is already in the room, update their status and emit a "rejoined" message
        participant.status = "connected";
        io.to(roomId).emit("receiveMessage", {
          username: "System",
          message: `${user.username} has rejoined the room`,
          roomId,
          timestamp: new Date(),
        });
      } else {
        // If the user isn't found, create a new tempId if they are unauthenticated
        let tempId = uuidv4();
        while (room.participants.find((p) => p.tempId === tempId)) {
          tempId = uuidv4();
        }

        room.participants.push({
          userId: user.userId ? mongoose.Types.ObjectId(user.userId) : null,
          username: user.username,
          tempId: user.userId ? null : tempId,
          status: "connected",
        });

        // Emit a "joined" message
        io.to(roomId).emit("receiveMessage", {
          username: "System",
          message: `${user.username} has joined the room`,
          roomId,
          timestamp: new Date(),
        });
      }

      room.lastActive = Date.now();
      await room.save();

      // Send the chat history to the user who just joined or rejoined (only once)
      socket.emit("loadChatHistory", room.messages);
    } catch (error) {
      console.error("Failed to handle joinRoom:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("leaveRoom", async ({ roomId, user }) => {
    try {
      socket.leave(roomId);
      console.log(`${user.username} left room: ${roomId}`);

      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      room.participants = room.participants.filter(
        (u) => u.userId !== user.userId && u.username !== user.username
      );
      await room.save();

      // Notify others in the room (only once)
      io.to(roomId).emit("userLeft", { users: room.participants });
    } catch (error) {
      console.error("Failed to handle leaveRoom:", error);
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  socket.on("closeRoom", async ({ roomId, user }) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Check if the user is the creator
      if (room.creator.userId !== user.userId) {
        socket.emit("error", {
          message: "Only the room creator can close the room",
        });
        return;
      }

      // Notify users and close the room (only once)
      io.to(roomId).emit("roomClosed", {
        message: "Room has been closed by the creator",
      });
      room.closed = true;
      await room.save();

      io.socketsLeave(roomId); // Disconnect all users from the room
    } catch (error) {
      console.error("Failed to handle closeRoom:", error);
      socket.emit("error", { message: "Failed to close room" });
    }
  });

  socket.on("removeUser", async ({ roomId, targetUserId, user }) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Check if the user is the creator
      if (room.creator.userId !== user.userId) {
        socket.emit("error", {
          message: "Only the room creator can remove users",
        });
        return;
      }

      room.participants = room.participants.filter(
        (u) => u.userId !== targetUserId
      );
      await room.save();

      // Notify others in the room (only once)
      io.to(roomId).emit("userRemoved", { userId: targetUserId });
      io.to(targetUserId).emit("removedFromRoom", { roomId });
    } catch (error) {
      console.error("Failed to handle removeUser:", error);
      socket.emit("error", { message: "Failed to remove user" });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Additional logic for handling disconnects can go here
  });
};
