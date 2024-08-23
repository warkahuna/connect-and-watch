import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  username: string;
  message: string;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessageAction(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    loadChatHistoryAction(state, action: PayloadAction<Message[]>) {
      state.messages = [...state.messages, ...action.payload];
    },
  },
});

export const { addChatMessageAction, loadChatHistoryAction } =
  chatSlice.actions;
export default chatSlice.reducer;
