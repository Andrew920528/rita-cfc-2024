import {PayloadAction, createSlice} from "@reduxjs/toolkit";

import {Session, Sessions} from "../schema/session";

const initialState: Sessions = {
  dict: {},
  current: "NONE",
};

const SessionsSlice = createSlice({
  name: "sessionsSlice",
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },

    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
  },
});

// This is used to perform action
export const SessionsServices = {
  actions: SessionsSlice.actions,
};

//This is stored in the main store
const SessionsReducer = SessionsSlice.reducer;
export default SessionsReducer;
