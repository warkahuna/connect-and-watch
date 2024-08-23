import React from "react";

const VideoControls: React.FC<{
  onPlay: () => void;
  onPause: () => void;
  onSkip: () => void;
}> = ({ onPlay, onPause, onSkip }) => {
  return (
    <div>
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onSkip}>Skip</button>
    </div>
  );
};

export default VideoControls;
