import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import socket from "../../services/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router-dom";
import { uploadVideoApi } from "../../services/api";

const VideoPlayer: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userRedux = useSelector((state: RootState) => state.auth.user);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isControlledExternally, setIsControlledExternally] =
    useState<boolean>(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    // Listen for when a video is added
    socket.on(
      "videoAdded",
      (data: { roomId: string; videoUrl: string; type: string }) => {
        if (data.roomId === roomId) {
          setVideoUrl(data.videoUrl);
          setIsPlaying(false); // Ensure video does not auto-play after URL is set
        }
      }
    );

    socket.on("playVideo", (data: { roomId: string; time: number }) => {
      console.log("hi");

      if (data.roomId === roomId) {
        setIsControlledExternally(true); // Prevent loop
        playerRef.current?.seekTo(data.time, "seconds");
        setIsPlaying(true); // Start playing the video
      }
    });

    socket.on("pauseVideo", (data: { roomId: string }) => {
      if (data.roomId === roomId) {
        setIsControlledExternally(true); // Prevent loop
        setIsPlaying(false); // Pause the video
      }
    });

    socket.on("seekVideo", (data: { roomId: string; time: number }) => {
      if (data.roomId === roomId) {
        playerRef.current?.seekTo(data.time, "seconds");
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
      userId: userRedux.id,
      type: "direct", // Assume direct URL for now
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("videoFile", file);
      formData.append("roomId", "" + roomId);
      formData.append("userId", userRedux.id);
      formData.append("username", userRedux.username);
      formData.append("type", "upload");

      try {
        const response = await uploadVideoApi("" + roomId, formData);
        const uploadedUrl = response.data.video.videoUrl;
        setVideoUrl(uploadedUrl);
        socket.emit("videoAdded", {
          roomId,
          videoUrl: uploadedUrl,
          userId: userRedux.id,
          type: "upload", // Mark this as an upload
        });
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handlePlay = () => {
    if (!isControlledExternally) {
      const time = playerRef.current?.getCurrentTime();
      if (time !== undefined) {
        socket.emit("playVideo", { roomId, time });
      }
    } else {
      setIsControlledExternally(false);
    }
  };

  const handlePause = () => {
    if (!isControlledExternally) {
      socket.emit("pauseVideo", { roomId });
    } else {
      setIsControlledExternally(false);
    }
  };

  const handleSeek = (time: number) => {
    socket.emit("seekVideo", { roomId, time });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste video URL here"
        value={videoUrl}
        onChange={handleUrlChange}
      />
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={isPlaying} // Control playing state with the internal state
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={(seconds) => handleSeek(seconds)}
      />
    </div>
  );
};

export default VideoPlayer;
