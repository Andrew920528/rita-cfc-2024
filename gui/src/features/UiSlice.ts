import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {useTypedSelector} from "../store/store";

interface UiState {
  loadingWidgets: {[key: string]: boolean};
  dragOffset: {x: number; y: number};
  dragOver: boolean;
}
const initialState: UiState = {
  loadingWidgets: {},
  dragOffset: {x: 0, y: 0},
  dragOver: false,
};

const UiSlice = createSlice({
  name: "UiSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setLoadingWidgets: (
      state,
      action: PayloadAction<{id: string; value: boolean}>
    ) => {
      state.loadingWidgets[action.payload.id] = action.payload.value;
    },
    setDragOffset: (state, action: PayloadAction<{x: number; y: number}>) => {
      state.dragOffset = action.payload;
    },
    setDragOver: (state, action: PayloadAction<boolean>) => {
      state.dragOver = action.payload;
    },
  },
});

export const UiServices = {
  actions: UiSlice.actions,
};

const UiReducer = UiSlice.reducer;
export default UiReducer;

// hooks for readability
export const useWidgetLoading = (widgetId: string) => {
  const loadingWidgets = useTypedSelector((state) => state.Ui.loadingWidgets);
  return widgetId in loadingWidgets && loadingWidgets[widgetId] === true;
};
