import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../schema/user";
import {Schedule, ScheduleHeadings, initSchedule} from "../schema/schedule";
import {LANG} from "../global/constants";

const initialState: User = {
  username: "",
  alias: "",
  school: "",
  occupation: "",
  schedule: initSchedule,
  classroomIds: [],
  scheduleChanged: false,
  lang: LANG.EN_US,
};

const UserSlice = createSlice({
  name: "userSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    parseLogin: (state, action: PayloadAction<User>) => {
      state.username = action.payload.username;
      state.alias = action.payload.alias;
      state.school = action.payload.school;
      state.occupation = action.payload.occupation;
      state.schedule = action.payload.schedule
        ? action.payload.schedule
        : initSchedule;
      state.classroomIds = action.payload.classroomIds;
      state.scheduleChanged = false;
      state.lang = action.payload.lang ? action.payload.lang : LANG.EN_US;
    },
    setProfile: (
      state,
      action: PayloadAction<{alias: string; school: string; occupation: string}>
    ) => {
      state.alias = action.payload.alias;
      state.school = action.payload.school;
      state.occupation = action.payload.occupation;
    },
    setLang: (state, action: PayloadAction<LANG>) => {
      state.lang = action.payload;
    },
    addClassroom: (state, action: PayloadAction<string>) => {
      state.classroomIds.push(action.payload);
    },
    deleteClassroom: (state, action: PayloadAction<string>) => {
      state.classroomIds = state.classroomIds.filter(
        (cId) => cId !== action.payload
      );
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
      state.scheduleChanged = true;
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
      state.scheduleChanged = true;
    },
    saveSchedule: (state) => {
      state.scheduleChanged = false;
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
