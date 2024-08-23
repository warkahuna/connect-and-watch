import React from "react";
import NotificationSettings from "../../components/Settings/NotificationSettings";
import ProfileSettings from "../../components/Settings/ProfileSettings";

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h2>Settings</h2>
      <ProfileSettings />
      <NotificationSettings />
    </div>
  );
};

export default SettingsPage;
