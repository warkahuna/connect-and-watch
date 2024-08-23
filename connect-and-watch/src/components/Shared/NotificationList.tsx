import React, { useState, useEffect } from "react";
import Notification from "./Notification";

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string; type: "info" | "success" | "error" }>
  >([
    { id: 1, message: "Welcome to the chat!", type: "info" },
    { id: 2, message: "New video added to the queue.", type: "success" },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  useEffect(() => {
    const timers = notifications.map(
      (notification) =>
        setTimeout(() => removeNotification(notification.id), 5000) // Remove after 5 seconds
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer)); // Clear timers on unmount
    };
  }, [notifications]);

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationList;
