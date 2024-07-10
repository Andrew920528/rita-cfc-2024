import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {Node, NodeChange, applyNodeChanges} from "reactflow";
import {EMPTY_ID} from "../global/constants";
import {useTypedSelector} from "../store/store";

interface UiState {
  draggingOver: boolean; // if widgetCard is dragged over a target
  loadingWidgets: {[key: string]: boolean};
}
const initialState: UiState = {
  draggingOver: false,
  loadingWidgets: {},
};

const UiSlice = createSlice({
  name: "UiSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setDraggingOver: (state, action: PayloadAction<boolean>) => {
      state.draggingOver = action.payload;
    },
    setLoadingWidgets: (
      state,
      action: PayloadAction<{id: string; value: boolean}>
    ) => {
      state.loadingWidgets[action.payload.id] = action.payload.value;
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
