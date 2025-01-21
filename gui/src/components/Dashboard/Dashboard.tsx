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
import {EMPTY_ID} from "../../global/constants";
import SetSemesterPlanPU from "../PopUps/SetSemesterPlanPU/SetSemesterPlanPU";
import {TText} from "../TText/TText";

const cx = classNames.bind(styles);
const DashboardPlaceHolder = () => {
  return (
    <div className={cx("dp-wrapper")}>
      <div className={cx("dashboard-placeholder")}>
        <div className={cx("dp-header-row")}>
          <Cafe size={20} />
          <p className={cx("dp-title")}>
            <TText>Hello there. Would you like a cup of coffee?</TText>
          </p>
        </div>
        <p>
          <TText>You can add lesson preparation tools from the toolbar on the left.</TText>
          <br />
          <TText>And use assistantRitaTo help you complete tasks</TText>
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
  const openPlanPU = useTypedSelector(
    (state) => state.Ui.openSetSemesterPlanPU
  );
  const setOpenPlanPU = (trigger: boolean) => {
    dispatch(UiServices.actions.setOpenSetSemesterPlanPU(trigger));
  };
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

      <Chatroom
        chatroomId={
          lectures.dict[lectures.current]
            ? lectures.dict[lectures.current].chatroomId
            : EMPTY_ID
        }
      />

      {/* This component is activated by a semester plan widget,
          but it seems like react-flow introduces overrides css positioning, 
          so we use global states for the popup trigger */}
      <SetSemesterPlanPU
        trigger={openPlanPU}
        setTrigger={setOpenPlanPU}
        title="Set Semester Plan"
      />
    </div>
  );
};

export default Dashboard;
