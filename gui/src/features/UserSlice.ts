import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../schema/user";
import {Schedule, ScheduleHeadings} from "../schema/schedule";

const initialState: User = {
  username: "dum-username",
  alias: "使用者A",
  school: "dum-school",
  occupation: "dum-occupation",
  schedule: Array(8).fill({
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
  }),
  classrooms: [],
  scheduleChanged: false,
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
    updateSchedule: (state, action: PayloadAction<"add" | "delete">) => {
      if (action.payload === "add") {
        state.schedule.push({
          mon: "",
          tue: "",
          wed: "",
          thu: "",
          fri: "",
        });
      } else if (action.payload === "delete") {
        state.schedule.pop();
      }
    },
    updateScheduleCell: (
      state,
      action: PayloadAction<{
        day: ScheduleHeadings;
        period: number;
        value: string;
      }>
    ) => {
      if (action.payload.period >= state.schedule.length) {
        console.error("Invalid period");
        return;
      }
      state.schedule[action.payload.period][action.payload.day] =
        action.payload.value;
    },
    saveSchedule: (state) => {
      state.scheduleChanged = false;
      console.log("Saving schedule");
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
