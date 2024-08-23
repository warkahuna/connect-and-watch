import React from "react";
import UsernameForm from "../../components/Room/UsernameForm";
import { useLocation, useNavigate } from "react-router-dom";
import { setTemporaryUsernameActions } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";

const UsernamePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUsernameSubmit = (username: string) => {
    dispatch(setTemporaryUsernameActions(username));
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("roomId");
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      navigate("/create-room"); // Fallback to create room if roomId is not available
    }
  };
  return (
    <div>
      <h2>Enter Username</h2>
      <UsernameForm onSubmit={handleUsernameSubmit} />
    </div>
  );
};

export default UsernamePage;
