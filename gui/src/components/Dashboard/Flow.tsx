import React, {useCallback, useEffect, useMemo, useRef} from "react";
import ReactFlow, {
  Background,
  NodeProps,
  Controls,
  NodeChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import WidgetFrame from "../widgets/WidgetFrame/WidgetFrame";
import {RfServices} from "../../features/RfSlice";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {EMPTY_ID} from "../../global/constants";
import {useCreateWidgetWithApi} from "../NavBar/WidgetCard/WidgetCard";
import {WidgetType, widgetBook} from "../../schema/widget";

const nodeTypes = {widget: WidgetNode};

export default function Flow() {
  // Global states
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const nodes = useTypedSelector((state) => state.Rf.nodes);
  const widgetDict = useTypedSelector((state) => state.Widgets.dict);
  const onNodesChange = (changes: NodeChange[]) =>
    dispatch(RfServices.actions.onNodesChange(changes));
  const flowRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  const {createWidget} = useCreateWidgetWithApi();
  useEffect(() => {
    const widgetIds = lectures.dict[lectures.current].widgetIds;
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
      RfServices.actions.setNodesWithWidgetList({
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
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let tstr = e.dataTransfer.getData("text/plain");
    let type = Number(tstr);

    let {x, y} = reactFlow.screenToFlowPosition({x: e.clientX, y: e.clientY});
    x = x - widgetBook[type as WidgetType].width / 2;
    y = y - widgetBook[type as WidgetType].minHeight / 2;
    // create widget and set position to x and y
    let wid = await createWidget(type);
    dispatch(
      RfServices.actions.setNodePosition({
        id: wid,
        position: {
          x,
          y,
        },
      })
    );
  };

  return (
    <div
      style={{width: "100%", height: "100%"}}
      ref={flowRef}
      onDrop={(e) => {
        handleDrop(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onPaneClick={(event: React.MouseEvent<Element, MouseEvent>) =>
          deselectWidget(event)
        }
        onNodeDragStart={(_, node) => {
          // note: node drag start is called even with just a click
          dispatch(RfServices.actions.onNodeDragStart(node.id));
        }}
        onNodeDragStop={() => {
          dispatch(RfServices.actions.onNodeDragEnd());
        }}
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
