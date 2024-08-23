import React, { useEffect } from "react";
import RoomCreation from "../../components/Room/RoomCreation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const RoomCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const username = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    if (!isAuthenticated && !username) {
      navigate("/username"); // Redirect to the UsernamePage if not authenticated
    }
  }, [isAuthenticated, username, navigate]);

  return (
    <div>
      <h2>Create or Join a Room</h2>
      <RoomCreation />
    </div>
  );
};

export default RoomCreationPage;
