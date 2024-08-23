import React from "react";
import { Navigate } from "react-router-dom";

// This function checks whether the user is authenticated.
// Replace this with your actual authentication logic.
const isAuthenticated = (): boolean => {
  // Example: checking for a valid token in localStorage
  return !!localStorage.getItem("authToken");
};

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any; // This allows passing additional props
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
