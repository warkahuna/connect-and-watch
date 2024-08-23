import React from "react";

const ChatMessage: React.FC<{ username: string; message: string }> = ({
  username,
  message,
}) => {
  return (
    <div>
      {username.length > 0 && <strong>{username}:</strong>} {message}
    </div>
  );
};

export default ChatMessage;
