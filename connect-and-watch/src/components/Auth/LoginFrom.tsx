import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../store/slices/authSlice";
import { loginApi } from "../../services/api";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginApi({ username, password });
      dispatch(
        loginAction({ user: response.data.user, token: response.data.token })
      );
      navigate("/"); // Redirect to the home screen or another page after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
