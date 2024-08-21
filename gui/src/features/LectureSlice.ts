import {PayloadAction, createSlice} from "@reduxjs/toolkit";

import {Lecture, Lectures} from "../schema/lecture";
import {EMPTY_ID} from "../global/constants";

const initialState: Lectures = {
  dict: {},
  current: EMPTY_ID,
};

const LecturesSlice = createSlice({
  name: "lecturesSlice",
  initialState,
  reducers: {
    parseLogin: (
      state,
      action: PayloadAction<{dict: {[key: string]: Lecture}; current: string}>
    ) => {
      state.dict = action.payload.dict;
      state.current = action.payload.current;
    },
    addLecture: (state, action: PayloadAction<Lecture>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteLecture: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    editLecture: (state, action: PayloadAction<{id: string; name: string}>) => {
      state.dict[action.payload.id].name = action.payload.name;
    },

    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },

    addWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgetIds.push(
        action.payload.widgetId
      );
    },

    deleteWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgetIds = state.dict[
        action.payload.lectureId
      ].widgetIds.filter((w) => w !== action.payload.widgetId);
    },
  },
});

// This is used to perform action
export const LecturesServices = {
  actions: LecturesSlice.actions,
};

//This is stored in the main store
const LecturesReducer = LecturesSlice.reducer;
export default LecturesReducer;
