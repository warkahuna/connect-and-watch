import React, { useState } from "react";

const ChatInput: React.FC<{ onSend: (message: string) => void }> = ({
  onSend,
}) => {
  const [message, setMessage] = useState<string>("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
