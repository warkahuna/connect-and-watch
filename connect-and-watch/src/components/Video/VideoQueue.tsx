import React, { useEffect, useState } from "react";
import socket from "../../services/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "../../styles/VideoQueue.css";
import { useParams } from "react-router-dom";
import { listVideosApi } from "../../services/api";

/*interface VideoQueueProps {
  videos: {
    videoId: string;
    videoUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
    type: string;
  }[];
}*/

const VideoQueue: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userRedux = useSelector((state: RootState) => state.auth.user);
  const [videoUrlInput, setVideoUrlInput] = useState<string>("");
  const [videos, setVideos] = useState<any>([]);

  useEffect(() => {
    if (videos.length === 0) {
      fetchCurrentVideoList();
    }

    socket.on(
      "addToQueue",
      (data: {
        roomId: string;
        videoUrl: string;
        type: string;
        videosList: [];
      }) => {
        console.log(data);

        if (data.roomId === roomId) {
          setVideos(orderByDate(data.videosList, "uploadedAt"));
        }
      }
    );
  }, []);

  function orderByDate<T>(objectsArray: T[], dateProperty: keyof T): T[] {
    return objectsArray.sort(
      (a, b) =>
        +new Date(a[dateProperty] as string) -
        +new Date(b[dateProperty] as string)
    );
  }

  const fetchCurrentVideoList = async () => {
    try {
      const response = await listVideosApi("" + roomId);
      setVideos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayVideo = (videoId: string) => {
    const selectedVideo = videos.find((video: any) => video._id === videoId);
    console.log(videos);

    if (selectedVideo) {
      console.log(selectedVideo);

      socket.emit("playQueueVideo", {
        roomId,
        videoUrl: selectedVideo.videoUrl,
        videoId: selectedVideo.videoId,
        type: "direct",
        time: 0, // Start from the beginning
        //userId: userRedux.id,
      });
    }
  };

  const handleAddVideo = () => {
    if (videoUrlInput.trim() !== "") {
      socket.emit("addToQueue", {
        roomId,
        videoUrl: videoUrlInput,
        //userId: userRedux.id,
        username: userRedux.username,
        queue: true,
        type: "direct", // Assuming the input is a direct link for now
      });

      // Clear input field after submission
      setVideoUrlInput("");
    }
  };

  return (
    <div className="video-queue">
      <h3>Video Queue</h3>
      <div className="add-video">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrlInput}
          onChange={(e) => setVideoUrlInput(e.target.value)}
        />
        <button onClick={handleAddVideo}>Add Video</button>
      </div>
      {videos.map((video: any) => (
        <div key={video.videoId} className="queue-item">
          <span>{video.videoUrl}</span>
          <button onClick={() => handlePlayVideo(video._id)}>Play</button>
        </div>
      ))}
    </div>
  );
};

export default VideoQueue;
