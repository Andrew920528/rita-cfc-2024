import React, {useEffect, useState} from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "../Chatroom/Chatroom";
import {useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import Flow from "./Flow";
import {ReactFlowProvider} from "reactflow";

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
  return (
    <div className={cx("dashboard")}>
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
