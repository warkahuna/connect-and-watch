import React, { useEffect, useState } from "react";
import socket from "../../services/socket";

interface RoomProps {
  roomId: string;
  username: string;
}

const Room: React.FC<RoomProps> = ({ roomId, username }) => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", { roomId, user: { username, userId: socket.id } });

    socket.on("userJoined", (data) => {
      setUsers(data.users);
    });

    socket.on("userLeft", (data) => {
      setUsers(data.users);
    });

    return () => {
      socket.emit("leaveRoom", {
        roomId,
        user: { username, userId: socket.id },
      });
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, [roomId, username]);

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <h3>Users in Room:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Room;
