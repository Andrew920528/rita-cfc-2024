import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../schema/user";
import {Schedule} from "../schema/schedule";
import {Classroom, Classrooms} from "../schema/classroom";
import {EMPTY_ID} from "../global/constants";
import {stat} from "fs";

const initialState: Classrooms = {
  dict: {},
  current: EMPTY_ID,
  loading: {},
};

const ClassroomsSlice = createSlice({
  name: "classroomsSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    parseLogin: (
      state,
      action: PayloadAction<{dict: {[key: string]: Classroom}; current: string}>
    ) => {
      state.dict = action.payload.dict;
      state.current = action.payload.current;
    },
    addClassroom: (state, action: PayloadAction<Classroom>) => {
      state.dict[action.payload.id] = action.payload;
    },
    editClassroom: (state, action: PayloadAction<Classroom>) => {
      // editable fields: name, subject, grade, publisher
      state.dict[action.payload.id].name = action.payload.name;
      state.dict[action.payload.id].subject = action.payload.subject;
      state.dict[action.payload.id].grade = action.payload.grade;
      state.dict[action.payload.id].publisher = action.payload.publisher;
      state.dict[action.payload.id].credits = action.payload.credits;
    },
    setLoading: (
      state,
      action: PayloadAction<{id: string; loading: boolean}>
    ) => {
      state.loading[action.payload.id] = action.payload.loading;
    },

    deleteClassroom: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    addLecture: (
      state,
      action: PayloadAction<{classroomId: string; lectureId: string}>
    ) => {
      state.dict[action.payload.classroomId].lectureIds.push(
        action.payload.lectureId
      );
      state.dict[action.payload.classroomId].lastOpenedLecture =
        action.payload.lectureId;
    },
    setLastOpenedLecture: (
      state,
      action: PayloadAction<{classroomId: string; lectureId: string}>
    ) => {
      state.dict[action.payload.classroomId].lastOpenedLecture =
        action.payload.lectureId;
    },
    deleteLecture: (
      state,
      action: PayloadAction<{classroomId: string; lectureId: string}>
    ) => {
      const index = state.dict[action.payload.classroomId].lectureIds.indexOf(
        action.payload.lectureId
      );
      if (index > -1) {
        state.dict[action.payload.classroomId].lectureIds.splice(index, 1);
      }
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
