import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {ChatMessage, Chatroom, Chatrooms} from "../schema/chatroom";
import {EMPTY_ID} from "../utils/constants";

const initialState: Chatrooms = {
  dict: {},
  current: EMPTY_ID,
};

const ChatroomsSlice = createSlice({
  name: "chatroomsSlice",
  initialState,
  reducers: {
    addChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{chatroomId: string; message: ChatMessage}>
    ) => {
      state.dict[action.payload.chatroomId].messages.push(
        action.payload.message
      );
    },
  },
});

// This is used to perform action
export const ChatroomsServices = {
  actions: ChatroomsSlice.actions,
};

//This is stored in the main store
const ChatroomsReducer = ChatroomsSlice.reducer;
export default ChatroomsReducer;
