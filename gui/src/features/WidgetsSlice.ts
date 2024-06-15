import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {Widget, Widgets} from "../schema/widget";

const initialState: Widgets = {
  dict: {},
  current: "NONE",
};

const WidgetsSlice = createSlice({
  name: "WidgetsSlice",
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
    updateWidget: (state, action: PayloadAction<Widget>) => {
      state.dict[action.payload.id] = action.payload;
    },
  },
});

// This is used to perform action
export const WidgetsServices = {
  actions: WidgetsSlice.actions,
};

//This is stored in the main store
const SessionsReducer = WidgetsSlice.reducer;
export default SessionsReducer;
