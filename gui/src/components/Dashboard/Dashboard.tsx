import React, {useEffect, useRef, useState} from "react";
import {Add, Cafe} from "@carbon/icons-react";
import Chatroom from "../Chatroom/Chatroom";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import Flow from "./Flow";
import {ReactFlowProvider} from "reactflow";
import {useCreateWidgetWithApi} from "../NavBar/WidgetCard/WidgetCard";
import {RfServices} from "../../features/RfSlice";
import {WidgetType, widgetBook} from "../../schema/widget";

const cx = classNames.bind(styles);
const DashboardPlaceHolder = () => {
  return (
    <div className={cx("dp-wrapper")}>
      <div className={cx("dashboard-placeholder")}>
        <div className={cx("dp-header-row")}>
          <Cafe size={20} />
          <p className={cx("dp-title")}>老師好。來杯咖啡嗎？</p>
        </div>
        <p>
          您可以由左側工具欄新增備課工具，
          <br />
          並利用小助教Rita幫助您完成工作
        </p>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const {createWidget} = useCreateWidgetWithApi();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let tstr = e.dataTransfer.getData("text/plain");
    let type = Number(tstr);
    console.log(e.clientX, e.clientY);
    let x = e.clientX;
    let y = e.clientY;
    if (dashboardRef.current?.getBoundingClientRect()) {
      x = e.clientX - dashboardRef.current?.getBoundingClientRect().x;
      y = e.clientY - dashboardRef.current?.getBoundingClientRect().y;
    }
    x = x - widgetBook[type as WidgetType].width / 2;
    y = y - widgetBook[type as WidgetType].minHeight / 2;
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
      className={cx("dashboard")}
      onDrop={handleDrop}
      onDragEnter={() => setIsDraggingOver(true)}
      onDragLeave={() => setIsDraggingOver(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      ref={dashboardRef}
    >
      {lectures.dict[lectures.current] &&
      lectures.dict[lectures.current].widgetIds.length > 0 ? (
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      ) : (
        <DashboardPlaceHolder />
      )}

      <Chatroom />

      {isDraggingOver && (
        <div
          ref={addRef}
          style={{
            position: "fixed",
            top: -1000,
            left: -1000,
            display: "none",
            opacity: 0.5,
          }}
        >
          <Add />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
