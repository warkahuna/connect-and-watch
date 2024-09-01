import React from "react";
/*import { useSelector } from "react-redux";
import { RootState } from "../../store/store";*/
import { closeRoomApi } from "../../services/api";
import { useParams } from "react-router-dom";

const AdminControls: React.FC = ({}) => {
  //const roomIdRedux = useSelector((state: RootState) => state.room.currentRoom);
  const { roomId } = useParams<{ roomId: string }>();

  const handleCloseRoom = async () => {
    const response = await closeRoomApi("" + roomId);
    const data = await response.data;
    console.log("close room", data);
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
    console.log("remove user", data);

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
