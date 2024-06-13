import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../schema/user";
import {Schedule} from "../schema/schedule";
import {Classroom, Classrooms} from "../schema/classroom";

const initialState: Classrooms = {
  dict: {},
  current: "NONE",
};

const ClassroomsSlice = createSlice({
  name: "classroomsSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    addClassroom: (state, action: PayloadAction<Classroom>) => {
      state.dict[action.payload.id] = action.payload;
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
  },
});

// This is used to perform action
export const ClassroomsServices = {
  actions: ClassroomsSlice.actions,
};

//This is stored in the main store
const ClassroomsReducer = ClassroomsSlice.reducer;
export default ClassroomsReducer;
