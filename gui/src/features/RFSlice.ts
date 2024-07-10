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
interface RfState {
  nodes: Node[];
  dict: {[id: string]: NodeDimension};
  draggingNodeId: string;
}
const initialState: RfState = {
  nodes: [],
  dict: {},
  draggingNodeId: EMPTY_ID,
};

const RfSlice = createSlice({
  name: "RfSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setNodesWithWidgetList: (
      state,
      action: PayloadAction<{
        widgetList: string[];
        canvasBound: number;
        topLeftX: number;
        topLeftY: number;
        widgetDict: {[id: string]: Widget};
      }>
    ) => {
      let widgetList = action.payload.widgetList;
      let widgetDict = action.payload.widgetDict;
      // nodes should only contain nodes that are in widgetList (we don't actually delete the nodes)
      let newNodes = [...state.nodes].filter((node) =>
        widgetList.includes(node.id)
      );

      // if a node is not in nodes, add it
      let toAdd = widgetList.filter(
        (nodeId) => !newNodes.map((node) => node.id).includes(nodeId)
      );

      // make sure dict contains all nodes
      let temp = newNodes.map((node) => node.id);
      for (let nodeId of toAdd) {
        let startX = action.payload.topLeftX + 8;
        let startY = action.payload.topLeftY + 8;
        console.log("startX", startX, "startY", startY);
        let w = widgetBook[widgetDict[nodeId].type].width;
        let h = widgetBook[widgetDict[nodeId].type].minHeight;
        let spacing = 8;
        if (!state.dict[nodeId]) {
          let {x, y} = findNextAvailableSpace(
            startX,
            startY,
            w,
            h,
            action.payload.canvasBound,
            temp.map((id) => state.dict[id]),
            spacing
          );
          state.dict[nodeId] = {
            x: x,
            y: y,
            width: w, // TODO define widget sizes
            height: h,
          };
        }
        temp.push(nodeId);
      }

      for (let widgetId of toAdd) {
        let nodeDimension = state.dict[widgetId];
        let node = initNode(widgetId, nodeDimension);
        newNodes.push(node);
      }
      state.nodes = [...newNodes];
    },

    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
      // updates the dict accordingly
      for (let node of action.payload as NodeChange[]) {
        if (node.type === "position" && node.position) {
          state.dict[node.id].x = node.position.x;
          state.dict[node.id].y = node.position.y;
        }

        if (node.type === "dimensions" && node.dimensions) {
          state.dict[node.id].width = node.dimensions.width;
          state.dict[node.id].height = node.dimensions.height;
        }
      }
    },
    setNodePosition: (
      state,
      action: PayloadAction<{id: string; position: {x: number; y: number}}>
    ) => {
      state.dict[action.payload.id].x = action.payload.position.x;
      state.dict[action.payload.id].y = action.payload.position.y;
      state.nodes.filter((node) => node.id === action.payload.id)[0].position =
        {
          ...state.dict[action.payload.id],
        };
    },

    addNode: (
      state,
      action: PayloadAction<{id: string; dimension: NodeDimension}>
    ) => {
      // adds node to dictionary
      state.dict[action.payload.id] = action.payload.dimension;
    },

    onNodeDragStart: (state, action) => {
      state.draggingNodeId = action.payload;
    },
    onNodeDrag: (state, action) => {
      if (state.draggingNodeId !== EMPTY_ID) {
        state.draggingNodeId = action.payload;
      }
    },
    onNodeDragEnd: (state) => {
      state.draggingNodeId = EMPTY_ID;
    },
  },
});

export const RfServices = {
  actions: RfSlice.actions,
};

const RfReducer = RfSlice.reducer;
export default RfReducer;

// helper functions
function initNode(id: string, dimension: NodeDimension) {
  return {
    id: id,
    type: "widget",
    position: {
      x: dimension.x,
      y: dimension.y,
    },
    data: {},
    width: dimension.width,
    height: dimension.height,
    dragHandle: "." + cx("draggable-area") + ", ." + cx("wf-heading"),
  };
}

function isOverlapping(
  newNode: NodeDimension,
  existingNodes: NodeDimension[]
): boolean {
  return existingNodes.some((node) => {
    const isOverlappingX =
      newNode.x < node.x + node.width && newNode.x + newNode.width > node.x;
    const isOverlappingY =
      newNode.y < node.y + node.height && newNode.y + newNode.height > node.y;
    return isOverlappingX && isOverlappingY;
  });
}

// returns position of the next available space
function findNextAvailableSpace(
  startX: number,
  startY: number,
  nodeWidth: number,
  nodeHeight: number,
  canvasWidth: number,
  otherNodes: NodeDimension[],
  spacing: number
): {x: number; y: number} {
  let x = startX;
  let y = startY;
  let cols: Set<number> = new Set([startX]);
  let rows: Set<number> = new Set([startY]);
  for (let node of otherNodes) {
    // get the node at the last y position with the shortest height
    rows.add(node.y + node.height);
    cols.add(node.x + node.width);
  }

  let colsList = Array.from(cols);
  colsList.sort((a, b) => a - b);

  let rowsList = Array.from(rows);
  rowsList.sort((a, b) => a - b);

  let currCol = 0;
  let currRow = 0;
  while (true) {
    const newNodeDimension: NodeDimension = {
      x,
      y,
      width: nodeWidth,
      height: nodeHeight,
    };
    if (!isOverlapping(newNodeDimension, otherNodes)) {
      return {x, y};
    }
    currCol++;
    x = colsList[currCol] + spacing;
    if (x + nodeWidth > canvasWidth) {
      currRow++;
      currCol = 0;
      x = startX;
      y = rowsList[currRow] + spacing;
    }
  }
}
