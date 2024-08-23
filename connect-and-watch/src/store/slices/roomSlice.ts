import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRoomData } from "../../services/api";

interface RoomState {
  rooms: any[];
  currentRoom: any | null;
  videos: any[];
  chatHistory: any[];
}

const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  videos: [],
  chatHistory: [],
};

export const fetchRoomData = createAsyncThunk(
  "room/fetchRoomData",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await getRoomData(roomId);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    createRoomAction(state, action: PayloadAction<any>) {
      state.rooms.push(action.payload);
      state.currentRoom = action.payload;
    },
    joinRoomAction(state, action: PayloadAction<any>) {
      state.currentRoom = action.payload;
    },
    leaveRoomAction(state) {
      state.currentRoom = null;
    },
    setCurrentRoomAction(state, action: PayloadAction<any>) {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomData.fulfilled, (state, action) => {
      state.currentRoom = action.payload.room;
      state.videos = action.payload.videos;
      state.chatHistory = action.payload.chatHistory;
    });
    builder.addCase(fetchRoomData.rejected, (state, action) => {
      // handle error
      console.error(state);
    });
  },
});

export const {
  createRoomAction,
  joinRoomAction,
  leaveRoomAction,
  setCurrentRoomAction,
} = roomSlice.actions;
export default roomSlice.reducer;
