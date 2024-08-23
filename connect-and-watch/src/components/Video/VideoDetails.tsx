import React from "react";

const VideoDetails: React.FC<{ title: string; duration: string }> = ({
  title,
  duration,
}) => {
  return (
    <div>
      <h4>Now Playing: {title}</h4>
      <p>Duration: {duration}</p>
    </div>
  );
};

export default VideoDetails;
