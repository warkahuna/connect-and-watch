import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setCurrentVideoAction } from "../../store/slices/videoSlice";
import socket from "../../services/socket";

const VideoQueue: React.FC = () => {
  const videos = useSelector((state: RootState) => state.video.videos);
  const currentVideo = useSelector(
    (state: RootState) => state.video.currentVideo
  );
  const dispatch = useDispatch();

  const handleVideoClick = (video: any) => {
    dispatch(setCurrentVideoAction(video));
  };

  useEffect(() => {
    // Handle real-time updates for the video queue
    socket.on("videoAdded", (video: any) => {
      // Update Redux state with the new video
    });

    return () => {
      socket.off("videoAdded");
    };
  }, [dispatch]);

  return (
    <div>
      <h3>Video Queue</h3>
      <ul>
        {videos.map((video, index) => (
          <li
            key={index}
            onClick={() => handleVideoClick(video)}
            style={{
              cursor: "pointer",
              fontWeight: video === currentVideo ? "bold" : "normal",
            }}
          >
            {video.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoQueue;
