import React, {useCallback, useEffect, useMemo, useRef} from "react";
import ReactFlow, {
  Background,
  NodeProps,
  Controls,
  Node,
  NodeChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import WidgetFrame from "../widgets/WidgetFrame/WidgetFrame";
import {NodeDimension, RFServices} from "../../features/RFSlice";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {EMPTY_ID} from "../../global/constants";

const nodeTypes = {widget: WidgetNode};

export default function Flow() {
  // Global states
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const nodes = useTypedSelector((state) => state.RF.nodes);
  const widgetDict = useTypedSelector((state) => state.Widgets.dict);
  const onNodesChange = (changes: NodeChange[]) =>
    dispatch(RFServices.actions.onNodesChange(changes));

  const flowRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  useEffect(() => {
    const widgetIds = lectures.dict[lectures.current].widgetIds;
    console.log(reactFlow.getViewport());
    const {x, y, zoom} = reactFlow.getViewport();
    let canvasBound;
    if (flowRef.current?.offsetWidth) {
      canvasBound = (flowRef.current?.offsetWidth - x) / zoom;
    } else {
      canvasBound = 0;
    }
    let topLeftX = -x / zoom;
    let topLeftY = -y / zoom;
    dispatch(
      RFServices.actions.setNodesWithWidgetList({
        widgetList: widgetIds,
        canvasBound: canvasBound,
        topLeftX: topLeftX,
        topLeftY: topLeftY,
        widgetDict: widgetDict,
      })
    );
  }, [lectures]);
  const deselectWidget = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
    }
  };
  return (
    <div style={{width: "100%", height: "100%"}} ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onPaneClick={(event: React.MouseEvent<Element, MouseEvent>) =>
          deselectWidget(event)
        }
      >
        <Controls />
        <Background variant={"dots" as any} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

function WidgetNode(props: NodeProps) {
  const widgets = useTypedSelector((state) => state.Widgets);
  if (widgets.dict[props.id] === undefined) return;
  return (
    <WidgetFrame widgetId={props.id} selected={props.id === widgets.current} />
  );
}
