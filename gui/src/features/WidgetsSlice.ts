import {PayloadAction, createSlice, current} from "@reduxjs/toolkit";
import {Widget, WidgetType, Widgets} from "../schema/widget/widget";
import {EMPTY_ID} from "../global/constants";
import {act} from "react";
import {
  Question,
  WorksheetWidgetContent,
} from "../schema/widget/worksheetWidgetContent";
import {generateId} from "../utils/util";

type MiscProps = {
  applyPreview: {[id: string]: boolean};
};

const initialState: Widgets & MiscProps = {
  dict: {},
  previewDict: {},
  current: EMPTY_ID,
  unsaved: {},
  creating: {},
  applyPreview: {},
};

const WidgetsSlice = createSlice({
  name: "WidgetsSlice",
  initialState,
  reducers: {
    parseLogin: (
      state,
      action: PayloadAction<{dict: {[key: string]: Widget}; current: string}>
    ) => {
      state.dict = action.payload.dict;
      state.current = action.payload.current;
      state.unsaved = {};
    },
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.dict[action.payload.id] = action.payload;
    },
    addPreviewWidget: (
      state,
      action: PayloadAction<Omit<Widget, "chatroomId">>
    ) => {
      let id = action.payload.id;
      let content = action.payload.content;
      let type = action.payload.type;
      let newWidget = {
        id,
        type,
        content,
        chatroomId: EMPTY_ID,
      };
      state.previewDict[id] = newWidget;
    },
    removePreviewWidget: (state, action: PayloadAction<string>) => {
      delete state.previewDict[action.payload];
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
      delete state.previewDict[action.payload];
      if (action.payload in state.unsaved) {
        delete state.unsaved[action.payload];
      }
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      if (!(action.payload in state.dict)) {
        state.current = EMPTY_ID; //
        return;
      }
      state.current = action.payload;
    },
    setChatroom: (
      state,
      action: PayloadAction<{widgetId: string; chatroomId: string}>
    ) => {
      if (!(action.payload.widgetId in state.dict)) {
        console.error("Attempt to set chatroom for widget that does not exist");
        return;
      }
      state.dict[action.payload.widgetId].chatroomId =
        action.payload.chatroomId;
    },
    updateWidget: (
      state,
      action: PayloadAction<{
        newWidget: Omit<Widget, "chatroomId">;
        mode: "preview" | "actual";
      }>
    ) => {
      const dict =
        action.payload.mode === "preview" ? state.previewDict : state.dict;
      const wid = action.payload.newWidget.id;
      if (!(wid in dict)) {
        console.error(
          `Attempt to update widget that does not exist [${action.payload.mode}]`
        );
        return;
      }
      const oldWidget = dict[wid];
      if (oldWidget.type !== action.payload.newWidget.type) {
        console.error(
          `Attempts to update widget, but given wrong payload type [${action.payload.mode}]`
        );
        return;
      }
      oldWidget.content = action.payload.newWidget.content;
      if (action.payload.mode !== "preview" && !(wid in state.unsaved)) {
        state.unsaved[wid] = true;
      }
    },
    saveAll: (state) => {
      state.unsaved = {};
    },
    setCreating: (state, action: PayloadAction<string>) => {
      state.creating[action.payload] = true;
    },
    unsetCreating: (state, action: PayloadAction<string>) => {
      delete state.creating[action.payload];
    },
    setApplyPreview: (
      state,
      action: PayloadAction<{id: string; value: boolean}>
    ) => {
      state.applyPreview[action.payload.id] = action.payload.value;
    },

    // Worksheet related actions
    addQuestion: (
      state,
      action: PayloadAction<{
        widgetId: string;
        question: Omit<Question, "questionId">;
      }>
    ) => {
      const wid = action.payload.widgetId;
      if (!(wid in state.dict)) {
        return;
      }
      const widget = state.dict[wid];

      let newQuestion = {
        questionId: generateId(),
        ...action.payload.question,
      };

      if (widget.type !== WidgetType.Worksheet) {
        return;
      }

      (widget.content as WorksheetWidgetContent).questions.push(newQuestion);
      state.unsaved[wid] = true;
    },
  },
});

function validateWidget(state: Widgets, wid: string) {
  return wid in state.dict;
}

// This is used to perform action
export const WidgetsServices = {
  actions: WidgetsSlice.actions,
};

// This is stored in the main store
const WidgetsReducer = WidgetsSlice.reducer;
export default WidgetsReducer;
