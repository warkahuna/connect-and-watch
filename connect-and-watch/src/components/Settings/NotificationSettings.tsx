import React, { useState } from "react";

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);

  const handleSave = () => {
    // Save notification settings logic
    console.log("Notification settings saved", {
      emailNotifications,
      pushNotifications,
    });
  };

  return (
    <div>
      <h3>Notification Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={(e) => setEmailNotifications(e.target.checked)}
        />
        Email Notifications
      </label>
      <label>
        <input
          type="checkbox"
          checked={pushNotifications}
          onChange={(e) => setPushNotifications(e.target.checked)}
        />
        Push Notifications
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default NotificationSettings;
