/**
 * This is a template for making a slice.
 * Remove this once you have a working slice.
 */

import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";

interface IncDecInitialStateType {
  currentNumber: number;
  loading: boolean;
  apiNumber: number | null;
  errorStatus: number | null;
} // the type of the initial state of slice.

const initialState: IncDecInitialStateType = {
  currentNumber: 0,
  loading: false,
  apiNumber: null,
  errorStatus: null,
};

const getRandomNumber = createAsyncThunk(
  "incDecSlice/getRandomNumber",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(
        "http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1"
      );
      const data = await response.data;
      return thunkApi.fulfillWithValue(data[0]);
    } catch (error) {
      const err = error as AxiosError;
      return thunkApi.rejectWithValue(err.response?.status);
    }
  }
);
/* 
  the first parameter in createAsync Thunk represents the redux action type constant
  a type argument generates 3 action types:
    1) pending: 'incDecSlice/getRandomNumber/pending'
    2) fulfilled: 'incDecSlice/getRandomNumber/fulfilled'
    3) rejected: 'incDecSlice/getRandomNumber/rejected'

  thunkApi is an object that contains parameters that are passed to redux thunk function
*/
const IncDecSlice = createSlice({
  name: "incDecSlice", //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {
    incrementNumber: (state) => {
      state.currentNumber += 1;
    },
    decrementNumber: (state) => {
      state.currentNumber -= 1;
    },
    incrementUserValue: (state, action) => {
      state.currentNumber += action.payload;
    },
    decrementUserValue: (state, action) => {
      state.currentNumber -= action.payload;
    },
    resetValue: (state) => {
      state.currentNumber = 0;
    },
  }, // action methods
  extraReducers: (builder) => {
    builder.addCase(getRandomNumber.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRandomNumber.fulfilled, (state, action) => {
      state.apiNumber = action.payload;
    });
    builder.addCase(getRandomNumber.rejected, (state, action) => {
      state.errorStatus = action.payload as number;
    });
    builder.addMatcher(
      isAnyOf(getRandomNumber.fulfilled, getRandomNumber.rejected),
      (state) => {
        state.loading = false;
      }
    );
  },
});
const IncDecThunks = {
  getRandomNumber,
};

export const IncDecServices = {
  ...IncDecThunks,
  actions: IncDecSlice.actions, //This includes all the action methods written above
};

const IncDecReducer = IncDecSlice.reducer; //This is stored in the main store
export default IncDecReducer;
