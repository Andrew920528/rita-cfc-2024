import React, {useEffect, useRef, useState} from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "../Chatroom/Chatroom";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import Flow from "./Flow";
import {ReactFlowProvider} from "reactflow";
import {useCreateWidgetWithApi} from "../../global/globalActions";
import {pointIsInRect} from "../../utils/util";
import {UiServices} from "../../features/UiSlice";

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
  const lectures = useTypedSelector((state) => state.Lectures);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const ui = useTypedSelector((state) => state.Ui);
  const {createWidget} = useCreateWidgetWithApi();
  const dispatch = useAppDispatch();
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let tstr = e.dataTransfer.getData("text/plain");
    let type = Number(tstr);
    let x = e.clientX;
    let y = e.clientY;
    if (dashboardRef.current?.getBoundingClientRect()) {
      x = e.clientX - dashboardRef.current?.getBoundingClientRect().x;
      y = e.clientY - dashboardRef.current?.getBoundingClientRect().y;
    }
    x = x - ui.dragOffset.x;
    y = y - ui.dragOffset.y;
    dispatch(UiServices.actions.setDragOver(false));
    await createWidget(type, {x, y});
  };
  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.stopPropagation();
    dispatch(UiServices.actions.setDragOver(true));
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (dashboardRef.current?.getBoundingClientRect()) {
      if (
        !pointIsInRect(
          {x: e.clientX, y: e.clientY},
          dashboardRef.current?.getBoundingClientRect()
        )
      ) {
        dispatch(UiServices.actions.setDragOver(false));
      }
    }
  }
  return (
    <div
      className={cx("dashboard", {isDragging: ui.dragOver})}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
    </div>
  );
};

export default Dashboard;
