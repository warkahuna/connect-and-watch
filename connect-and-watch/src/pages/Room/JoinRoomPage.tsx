import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomPage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/username?roomId=${roomId}`);
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoomPage;
