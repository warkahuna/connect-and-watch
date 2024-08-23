import React from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };

  return (
    <div>
      <h1>Welcome to Connect & Watch</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default HomeScreen;
