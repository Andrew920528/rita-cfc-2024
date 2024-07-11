import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {useTypedSelector} from "../store/store";

interface ApiState {
  signals: {[key: string]: boolean};
}
const initialState: ApiState = {
  signals: {},
};

const ApiSlice = createSlice({
  name: "UiSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setSignal: (
      state,
      action: PayloadAction<{id: string; signal: boolean}>
    ) => {
      state.signals[action.payload.id] = action.payload.signal;
    },
    deleteSignal: (state, action: PayloadAction<{id: string}>) => {
      delete state.signals[action.payload.id];
    },
  },
});

export const ApiServices = {
  actions: ApiSlice.actions,
};

const ApiReducer = ApiSlice.reducer;
export default ApiReducer;

// hooks for readability
