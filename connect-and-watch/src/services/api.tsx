import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
});

export const loginApi = (credentials: { username: string; password: string }) =>
  api.post("/auth/login", credentials);

export const signUpApi = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("/auth/signup", data);

export const createRoomApi = (data: { username: string; roomName: string }) =>
  api.post("/rooms/create", data);

export const joinRoomApi = (roomId: string, username: string) =>
  api.post(`/rooms/join`, { roomId, username });

export const uploadVideoApi = (roomId: string, videoData: FormData) =>
  api.post(`/videos/${roomId}/upload`, videoData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getRoomData = (roomId: string) => {
  return api.get(`/rooms/get-room-data/${roomId}`);
};

export const listVideosApi = (roomId: string) => {
  return api.get(`/videos/${roomId}/videos`);
};

export default api;
