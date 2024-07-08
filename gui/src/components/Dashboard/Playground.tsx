import React, {useCallback, useEffect, useMemo} from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Handle,
  Position,
  NodeProps,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import WidgetFrame, {
  WidgetFrameProps,
} from "../widgets/WidgetFrame/WidgetFrame";
import {
  useAddNode,
  useDeleteNode,
  useNodes,
  useOnNodesChange,
  useSetNodes,
} from "../../features/RFSlice";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {EMPTY_ID} from "../../global/constants";
import classNames from "classnames/bind";
import styles from "../widgets/WidgetFrame/WidgetFrame.module.scss";

const cx = classNames.bind(styles);

const nodeTypes = {widget: WidgetNode};
export default function Playground() {
  // Global states
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const nodes = useNodes();
  const addNode = useAddNode();
  const deleteNode = useDeleteNode();
  const onNodesChange = useOnNodesChange();
  useEffect(() => {
    let currentNodes = nodes.map((n) => n.id);
    const widgetIds = lectures.dict[lectures.current].widgetIds;
    if (currentNodes.length < widgetIds.length) {
      let newIds = widgetIds.filter((wid) => !currentNodes.includes(wid));
      for (let newId of newIds) {
        addNode({
          id: newId,
          type: "widget",
          position: {x: 0, y: 0},
          dragHandle: "." + cx("draggable-area") + ", ." + cx("wf-heading"),
          data: {},
        });
      }
    } else if (currentNodes.length > widgetIds.length) {
      let removedIds = currentNodes.filter((wid) => !widgetIds.includes(wid));

      for (let removedId of removedIds) {
        deleteNode(removedId);
      }
    }
  }, [lectures]);
  const deselectWidget = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
    }
  };
  return (
    <div style={{width: "100%", height: "100%"}}>
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
  return (
    <WidgetFrame widgetId={props.id} selected={props.id === widgets.current} />
  );
}
