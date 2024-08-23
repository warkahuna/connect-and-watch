import React from "react";

const Alert: React.FC<{ message: string; type: "success" | "error" }> = ({
  message,
  type,
}) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};

export default Alert;
