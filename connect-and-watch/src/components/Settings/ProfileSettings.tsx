import React, { useState } from "react";

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSave = () => {
    // Save profile settings logic
    console.log("Profile saved", { name, email });
  };

  return (
    <div>
      <h3>Profile Settings</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileSettings;
