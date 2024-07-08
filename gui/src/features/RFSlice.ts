import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {
  Edge,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import {useAppDispatch, useTypedSelector} from "../store/store";

interface RFState {
  nodes: Node[];
  edges: Edge[];
}
const initialState: RFState = {
  nodes: [],
  edges: [],
};

const RFSlice = createSlice({
  name: "RFSlice", //must be unique for every slice. convention is to put the same as file name
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect: (state, action) => {
      state.edges = addEdge(action.payload, state.edges);
    },
    addNode: (state, action: PayloadAction<Node>) => {
      if (state.nodes.map((n) => n.id).includes(action.payload.id)) {
        return;
      }
      state.nodes = [...state.nodes, action.payload];
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload);
    },
  },
});

// This is used to perform action
export const RFServices = {
  actions: RFSlice.actions,
};

//This is stored in the main store
const RFReducer = RFSlice.reducer;
export default RFReducer;

// hooks
export const useNodes = () => useTypedSelector((state) => state.RF.nodes);
export const useEdges = () => useTypedSelector((state) => state.RF.edges);

export const useSetNodes = () => {
  const dispatch = useAppDispatch();
  return (nodes: Node[]) => dispatch(RFServices.actions.setNodes(nodes));
};

export const useOnNodesChange = () => {
  const dispatch = useAppDispatch();
  return (changes: NodeChange[]) =>
    dispatch(RFServices.actions.onNodesChange(changes));
};
export const useAddNode = () => {
  const dispatch = useAppDispatch();
  return (node: Node) => dispatch(RFServices.actions.addNode(node));
};

export const useDeleteNode = () => {
  const dispatch = useAppDispatch();
  return (id: string) => dispatch(RFServices.actions.deleteNode(id));
};
