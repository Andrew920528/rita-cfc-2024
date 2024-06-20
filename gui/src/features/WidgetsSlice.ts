import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {NoteWidgetT, Widget, WidgetType, Widgets} from "../schema/widget";

const initialState: Widgets = {
  dict: {},
  current: "NONE",
};

const WidgetsSlice = createSlice({
  name: "WidgetsSlice",
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.dict[action.payload.id] = action.payload;
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      delete state.dict[action.payload];
    },
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
    updateWidget: (
      state,
      action: PayloadAction<{wid: string; newWidget: Widget}>
    ) => {
      if (
        state.dict[action.payload.wid].type !== action.payload.newWidget.type
      ) {
        console.error(
          "Attempts to update widget, but given wrong payload type"
        );
        return;
      }
      switch (action.payload.newWidget.type) {
        case WidgetType.SemesterGoal:
          console.log("update goal");
          break;
        case WidgetType.SemesterPlan:
          console.log("update plan");
          break;
        case WidgetType.Note:
          console.log("update note");
          updateNoteWidget(
            state,
            action as PayloadAction<{wid: string; newWidget: NoteWidgetT}>
          );
          break;
        case WidgetType.Schedule:
          console.log("update schedule");
          break;
      }
    },
  },
});

// This is used to perform action
export const WidgetsServices = {
  actions: WidgetsSlice.actions,
};

//This is stored in the main store
const WidgetsReducer = WidgetsSlice.reducer;
export default WidgetsReducer;

function updateNoteWidget(
  state: Widgets,
  action: PayloadAction<{wid: string; newWidget: NoteWidgetT}>
) {
  const {wid, newWidget} = action.payload;
  const oldWidget = state.dict[wid] as NoteWidgetT;

  if (!oldWidget) {
    console.error(`Widget with id ${wid} not found`);
    return;
  }
  oldWidget.content = newWidget.content;
}
