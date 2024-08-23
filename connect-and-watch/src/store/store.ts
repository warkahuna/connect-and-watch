import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import videoReducer from "./slices/videoSlice";
import chatReducer from "./slices/chatSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    video: videoReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
