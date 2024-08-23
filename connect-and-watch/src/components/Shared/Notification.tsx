import React from "react";

const Notification: React.FC<{
  id: number;
  message: string;
  type: "info" | "success" | "error";
  onClose: (id: number) => void;
}> = ({ id, message, type, onClose }) => {
  return (
    <div className={`notification notification-${type}`}>
      {message}
      <button
        onClick={() => onClose(id)}
        style={{ marginLeft: "10px", cursor: "pointer" }}
      >
        x
      </button>
    </div>
  );
};

export default Notification;
