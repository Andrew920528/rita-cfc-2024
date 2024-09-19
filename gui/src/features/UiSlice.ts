import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {useTypedSelector} from "../store/store";

interface UiState {
  dragOffset: {x: number; y: number}; // for widget card dragging
  dragOver: boolean; // for styling and logic when dragging widget card over dashboard, which metigate buggy html default drag api
  openSetSemesterPlanPU: boolean;
}
const initialState: UiState = {
  dragOffset: {x: 0, y: 0},
  dragOver: false,
  openSetSemesterPlanPU: false,
};

const UiSlice = createSlice({
  name: "UiSlice",
  initialState,
  reducers: {
    setDragOffset: (state, action: PayloadAction<{x: number; y: number}>) => {
      state.dragOffset = action.payload;
    },
    setDragOver: (state, action: PayloadAction<boolean>) => {
      state.dragOver = action.payload;
    },
    setOpenSetSemesterPlanPU: (state, action: PayloadAction<boolean>) => {
      state.openSetSemesterPlanPU = action.payload;
    },
  },
});

export const UiServices = {
  actions: UiSlice.actions,
};

const UiReducer = UiSlice.reducer;
export default UiReducer;
