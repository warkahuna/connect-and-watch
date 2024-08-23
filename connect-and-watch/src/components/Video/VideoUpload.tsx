import React, { useState } from "react";

const VideoUpload: React.FC<{
  roomId: string;
  onUpload: (video: any) => void;
}> = ({ roomId, onUpload }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploadType, setUploadType] = useState<string>("upload");

  const handleUpload = async () => {
    if (uploadType === "upload" && videoFile) {
      // Handle file upload
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("roomId", roomId);

      // Simulate upload and notify parent component
      onUpload({
        type: "upload",
        url: "/path/to/uploaded/video",
        title: videoFile.name,
      });
    } else if (uploadType === "url" && videoUrl) {
      // Handle URL upload
      onUpload({ type: "url", url: videoUrl, title: "External Video" });
    }
  };

  return (
    <div>
      <select
        onChange={(e) => setUploadType(e.target.value)}
        value={uploadType}
      >
        <option value="upload">Upload Video</option>
        <option value="url">Video URL</option>
      </select>

      {uploadType === "upload" ? (
        <input
          type="file"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        />
      ) : (
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      )}

      <button onClick={handleUpload}>Submit</button>
    </div>
  );
};

export default VideoUpload;
