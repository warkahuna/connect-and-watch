import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import socket from "../../services/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router-dom";
import { uploadVideoApi } from "../../services/api";
import "../../styles/VideoPlayer.css";

const SYNC_THRESHOLD = 0.5; // Allowable difference in seconds before resyncing

const VideoPlayer: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userRedux = useSelector((state: RootState) => state.auth.user);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    socket.on(
      "videoAdded",
      (data: { roomId: string; videoUrl: string; type: string }) => {
        if (data.roomId === roomId) {
          setVideoUrl(data.videoUrl);
          setIsPlaying(false); // Reset playing state when a new video is added
        }
      }
    );

    socket.on("playVideo", (data: { roomId: string; time: number }) => {
      if (data.roomId === roomId && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime() || 0;
        if (Math.abs(currentTime - data.time) > SYNC_THRESHOLD) {
          playerRef.current.seekTo(data.time, "seconds");
        }
        setIsPlaying(true); // Start playing the video
      }
    });

    socket.on("pauseVideo", (data: { roomId: string }) => {
      if (data.roomId === roomId) {
        setIsPlaying(false); // Pause the video
      }
    });

    socket.on("seekVideo", (data: { roomId: string; time: number }) => {
      if (data.roomId === roomId && playerRef.current) {
        playerRef.current.seekTo(data.time, "seconds");
      }
    });

    return () => {
      socket.off("videoAdded");
      socket.off("playVideo");
      socket.off("pauseVideo");
      socket.off("seekVideo");
    };
  }, [roomId]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    socket.emit("videoAdded", {
      roomId,
      videoUrl: url,
      //userId: userRedux.id,
      type: "direct",
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("videoFile", file);
      formData.append("roomId", roomId as string);
      formData.append("userId", userRedux.id);
      formData.append("username", userRedux.username);
      formData.append("type", "upload");

      try {
        const response = await uploadVideoApi(roomId as string, formData);
        const uploadedUrl = response.data.video.videoUrl;
        setVideoUrl(uploadedUrl);
        socket.emit("videoAdded", {
          roomId,
          videoUrl: uploadedUrl,
          //userId: userRedux.id,
          type: "upload",
        });
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handlePlay = () => {
    const time = playerRef.current?.getCurrentTime();
    if (time !== undefined) {
      socket.emit("playVideo", { roomId, time });
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    socket.emit("pauseVideo", { roomId });
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    socket.emit("seekVideo", { roomId, time });
  };

  return (
    <div className="video-player-container">
      <div className="video-player-content">
        <div className="input-row">
          <input
            type="text"
            placeholder="Paste video URL here"
            value={videoUrl}
            onChange={handleUrlChange}
          />
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={(seconds) => handleSeek(seconds)}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
