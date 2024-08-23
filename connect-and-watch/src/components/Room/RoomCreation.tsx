import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoomAction } from "../../store/slices/roomSlice";
import { createRoomApi } from "../../services/api";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

const RoomCreation: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.auth.user?.username);

  const handleCreateRoom = async () => {
    try {
      const response = await createRoomApi({ username, roomName });
      dispatch(createRoomAction(response.data.room));
      navigate(`/room/${response.data.roomId}`); // Redirect to the created room
    } catch (error) {
      console.error("Room creation failed", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreation;
