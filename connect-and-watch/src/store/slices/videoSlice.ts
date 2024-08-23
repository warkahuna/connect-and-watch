import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VideoState {
  videos: any[];
  currentVideo: any | null;
}

const initialState: VideoState = {
  videos: [],
  currentVideo: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    addVideoAction(state, action: PayloadAction<any>) {
      state.videos.push(action.payload);
    },
    removeVideoAction(state, action: PayloadAction<string>) {
      state.videos = state.videos.filter(
        (video) => video.id !== action.payload
      );
    },
    setCurrentVideoAction(state, action: PayloadAction<any>) {
      state.currentVideo = action.payload;
    },
  },
});

export const { addVideoAction, removeVideoAction, setCurrentVideoAction } =
  videoSlice.actions;
export default videoSlice.reducer;
