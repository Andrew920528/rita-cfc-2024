import React, {useState} from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "./Chatroom";
import WidgetFrame from "./widgets/WidgetFrame";
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
  const [content, setContent] = useState(["a"]);

  return (
    <div className="dashboard">
      {content.length > 0 ? (
        <div className="widgets">
          <WidgetFrame selected={true} />
          <WidgetFrame />
          <WidgetFrame />
          <WidgetFrame />
          <WidgetFrame selected={true} />
          <WidgetFrame />
        </div>
      ) : (
        <DashboardPlaceHolder />
      )}

      <Chatroom />
    </div>
  );
};

export default Dashboard;
