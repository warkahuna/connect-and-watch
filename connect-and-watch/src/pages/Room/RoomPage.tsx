import React, { useEffect } from "react";
import VideoPlayer from "../../components/Video/VideoPlayer";
import AdminControls from "../../components/Admin/AdminControls";
import VideoQueue from "../../components/Video/VideoQueue";
import ChatBox from "../../components/Room/ChatBox";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store/store";
import { fetchRoomData, joinRoomAction } from "../../store/slices/roomSlice";
import socket from "../../services/socket";
import "../../styles/RoomPage.css";
const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();

  const room = useSelector((state: RootState) => state.room.currentRoom);
  const username = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchRoomData(roomId));
      socket.emit("joinRoom", { roomId, user: { username: username } });
      dispatch(joinRoomAction(roomId));
    }

    return () => {
      socket.emit("leaveRoom", { roomId, user: { username: username } });
    };
  }, [roomId, dispatch]);

  if (!room) {
    return <div>Loading...</div>;
  }
  return (
    <div className="room-page">
      <div className="card video-queue">
        <VideoQueue />
      </div>
      <div className="card video-player">
        <VideoPlayer />
      </div>
      <div className="card chat-section">
        <div className="admin-controls">
          <AdminControls />
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default RoomPage;
