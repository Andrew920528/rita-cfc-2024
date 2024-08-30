import {PayloadAction, createSlice, current} from "@reduxjs/toolkit";

import {Lecture, Lectures} from "../schema/lecture";
import {EMPTY_ID} from "../global/constants";
import {Widget, WidgetType} from "../schema/widget/widget";

const initialState: Lectures = {
  dict: {},
  current: EMPTY_ID,
  loading: {},
};

const LecturesSlice = createSlice({
  name: "lecturesSlice",
  initialState,
  reducers: {
    parseLogin: (
      state,
      action: PayloadAction<{dict: {[key: string]: Lecture}; current: string}>
    ) => {
      state.dict = action.payload.dict;
      state.current = action.payload.current;
    },
    addLecture: (state, action: PayloadAction<Lecture>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteLecture: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    editLecture: (state, action: PayloadAction<{id: string; name: string}>) => {
      state.dict[action.payload.id].name = action.payload.name;
    },
    setLoading: (
      state,
      action: PayloadAction<{id: string; loading: boolean}>
    ) => {
      state.loading[action.payload.id] = action.payload.loading;
    },

    findSemesterGoal: (
      state,
      action: PayloadAction<{
        lectureId: string;
        widgetDict: {
          [id: string]: Widget;
        };
      }>
    ) => {
      let lectureId = action.payload.lectureId;
      let widgetDict = action.payload.widgetDict;
      if (!(lectureId in state.dict)) return;
      let semesterGoalId = EMPTY_ID;
      for (let wid of state.dict[lectureId].widgetIds) {
        if (
          wid in widgetDict &&
          widgetDict[wid].type === WidgetType.SemesterGoal
        ) {
          semesterGoalId = wid;
          break;
        }
      }
      state.dict[lectureId].semeterGoalId = semesterGoalId;
    },

    setSemesterGoalId: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].semeterGoalId =
        action.payload.widgetId;
    },

    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
    setChatroom: (
      state,
      action: PayloadAction<{lectureId: string; chatroomId: string}>
    ) => {
      state.dict[action.payload.lectureId].chatroomId =
        action.payload.chatroomId;
    },
    addWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgetIds.push(
        action.payload.widgetId
      );
    },

    deleteWidget: (
      state,
      action: PayloadAction<{lectureId: string; widgetId: string}>
    ) => {
      state.dict[action.payload.lectureId].widgetIds = state.dict[
        action.payload.lectureId
      ].widgetIds.filter((w) => w !== action.payload.widgetId);
    },
  },
});

// This is used to perform action
export const LecturesServices = {
  actions: LecturesSlice.actions,
};

//This is stored in the main store
const LecturesReducer = LecturesSlice.reducer;
export default LecturesReducer;
