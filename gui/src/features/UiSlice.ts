import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {Node, NodeChange, applyNodeChanges} from "reactflow";
import {useAppDispatch, useTypedSelector} from "../store/store";
import classNames from "classnames/bind";
import styles from "../components/widgets/WidgetFrame/WidgetFrame.module.scss";
import {Widget, widgetBook} from "../schema/widget";
import {EMPTY_ID} from "../global/constants";

const cx = classNames.bind(styles);
export type NodeDimension = {
  x: number;
  y: number;
  width: number;
  height: number;
};
interface UiState {
  nodes: Node[];
  dict: {[id: string]: NodeDimension};
  draggingNodeId: string;
}
const initialState: UiState = {
  nodes: [],
  dict: {},
  draggingNodeId: EMPTY_ID,
};

const UiSlice = createSlice({
  name: "UiSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {},
});

export const UiServices = {
  actions: UiSlice.actions,
};

const UiReducer = UiSlice.reducer;
export default UiReducer;
