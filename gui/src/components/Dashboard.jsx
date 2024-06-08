import React from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "./Chatroom";
const DashboardPlaceHolder = () => {
  return (
    <div className="dp-wrapper">
      <div className="dashboard-placeholder">
        <div className="dp-header-row">
          <Cafe size={20} />
          <p className="dp-title">老師好。來杯咖啡嗎？</p>
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
  return (
    <div className="dashboard">
      <DashboardPlaceHolder />
      <Chatroom />
    </div>
  );
};

export default Dashboard;
