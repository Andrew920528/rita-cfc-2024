import {PayloadAction, createSlice, current} from "@reduxjs/toolkit";
import {Widget, Widgets} from "../schema/widget";
import {EMPTY_ID} from "../global/constants";

const initialState: Widgets = {
  dict: {},
  current: EMPTY_ID,
  unsaved: {},
};

const WidgetsSlice = createSlice({
  name: "WidgetsSlice",
  initialState,
  reducers: {
    parseLogin: (
      state,
      action: PayloadAction<{dict: {[key: string]: Widget}; current: string}>
    ) => {
      state.dict = action.payload.dict;
      state.current = action.payload.current;
      state.unsaved = {};
    },
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
      if (action.payload in state.unsaved) {
        delete state.unsaved[action.payload];
      }
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
    updateWidget: (state, action: PayloadAction<{newWidget: Widget}>) => {
      const wid = action.payload.newWidget.id;
      if (!(wid in state.dict)) {
        console.error("Attempt to update widget that does not exist");
        return;
      }
      const oldWidget = state.dict[wid];
      if (oldWidget.type !== action.payload.newWidget.type) {
        console.error(
          "Attempts to update widget, but given wrong payload type"
        );
        return;
      }
      oldWidget.content = action.payload.newWidget.content;
      if (!(wid in state.unsaved)) {
        state.unsaved[wid] = true;
      }
    },
    saveAll: (state) => {
      state.unsaved = {};
    },
  },
});

// This is used to perform action
export const WidgetsServices = {
  actions: WidgetsSlice.actions,
};

//This is stored in the main store
const WidgetsReducer = WidgetsSlice.reducer;
export default WidgetsReducer;
