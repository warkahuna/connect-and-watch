// socket/chatsocket.js

const Room = require("../models/Room");

module.exports = (io, socket) => {
  socket.on("sendMessage", async (data) => {
    const { roomId, username, message } = data;

    try {
      // Find the room and update its messages array
      const room = await Room.findOne({ roomId });
      if (room) {
        const chatMessage = {
          username,
          message,
          timestamp: new Date(),
        };

        room.messages.push(chatMessage);
        await room.save();

        // Broadcast the message to others in the room
        io.to(roomId).emit("receiveMessage", chatMessage);
      }
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });
};
