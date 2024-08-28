import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {ChatMessage, Chatroom, Chatrooms} from "../schema/chatroom";
import {EMPTY_ID} from "../global/constants";

const initialState: Chatrooms = {
  dict: {},
  waitingForReply: {},
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
    addMessage: (
      state,
      action: PayloadAction<{chatroomId: string; message: ChatMessage}>
    ) => {
      state.dict[action.payload.chatroomId].messages.push(
        action.payload.message
      );
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{chatroomId: string; message: ChatMessage}>
    ) => {
      let lastIndex = state.dict[action.payload.chatroomId].messages.length - 1;
      state.dict[action.payload.chatroomId].messages[lastIndex] =
        action.payload.message;
    },
    setWaitingForReply: (
      state,
      action: PayloadAction<{chatroomId: string; waiting: boolean}>
    ): void => {
      state.waitingForReply[action.payload.chatroomId] = action.payload.waiting;
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
