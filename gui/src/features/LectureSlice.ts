import {PayloadAction, createSlice} from "@reduxjs/toolkit";

import {Lecture, Lectures} from "../schema/lecture";
import {EMPTY_ID} from "../utils/constants";

const initialState: Lectures = {
  dict: {},
  current: EMPTY_ID,
};

const LecturesSlice = createSlice({
  name: "lecturesSlice",
  initialState,
  reducers: {
    addLecture: (state, action: PayloadAction<Lecture>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteLecture: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },

    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },

    addWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgets.push(
        action.payload.widgetId
      );
    },

    deleteWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgets = state.dict[
        action.payload.lectureId
      ].widgets.filter((w) => w !== action.payload.widgetId);
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
