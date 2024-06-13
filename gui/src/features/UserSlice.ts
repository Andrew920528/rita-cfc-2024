import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../schema/user";
import {Schedule} from "../schema/schedule";

const initialState: User = {
  username: "dum-username",
  alias: "使用者A",
  school: "dum-school",
  occupation: "dum-occupation",
  schedule: {data: ""},
  classrooms: [],
};

const UserSlice = createSlice({
  name: "userSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setAlias: (state, action: PayloadAction<string>) => {
      state.alias = action.payload;
    },
    setSchool: (state, action: PayloadAction<string>) => {
      state.school = action.payload;
    },
    setOccupation: (state, action: PayloadAction<string>) => {
      state.occupation = action.payload;
    },
    addClassroom: (state, action: PayloadAction<string>) => {
      state.classrooms.push(action.payload);
    },
  },
});

// This is used to perform action
export const UserServices = {
  actions: UserSlice.actions,
};

//This is stored in the main store
const UserReducer = UserSlice.reducer;
export default UserReducer;
