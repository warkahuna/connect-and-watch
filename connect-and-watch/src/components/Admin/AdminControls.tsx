import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const AdminControls: React.FC = ({}) => {
  const roomId = useSelector((state: RootState) => state.room.currentRoom);

  const handleCloseRoom = async () => {
    const response = await fetch("/api/rooms/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    const data = await response.json();
    // Handle the response, update UI accordingly
  };

  const handleRemoveUser = async (
    targetUserId: string,
    isAuthenticated: boolean
  ) => {
    const response = await fetch(`/api/rooms/${roomId}/removeUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, isAuthenticated }),
    });
    const data = await response.json();
    // Handle the response, update UI accordingly
  };

  return (
    <div>
      <button onClick={handleCloseRoom}>Close Room</button>
      {/* Example of removing a user */}
      <button onClick={() => handleRemoveUser("targetUserId", true)}>
        Remove User
      </button>
    </div>
  );
};

export default AdminControls;
