import {PayloadAction, createSlice} from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  complete: false,
};

const LoginStatusSlice = createSlice({
  name: "loginStatusSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log("set loading to " + action.payload);
      state.loading = action.payload;
    },
    setComplete: (state, action: PayloadAction<boolean>) => {
      console.log("set complete to " + action.payload);
      state.complete = action.payload;
    },
  },
});

// This is used to perform action
export const LoginStatusServices = {
  actions: LoginStatusSlice.actions,
};

//This is stored in the main store
const LoginStatusReducer = LoginStatusSlice.reducer;
export default LoginStatusReducer;
