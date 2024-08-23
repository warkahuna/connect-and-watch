import React, { useState } from "react";

const UsernameForm: React.FC<{ onSubmit: (username: string) => void }> = ({
  onSubmit,
}) => {
  const [username, setUsername] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a unique username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Join Room</button>
    </form>
  );
};

export default UsernameForm;
