import React, {useEffect, useState} from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "./Chatroom";
import WidgetFrame from "./widgets/WidgetFrame";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {widgetBook} from "../schema/widget";
import {WidgetsServices} from "../features/WidgetsSlice";
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
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const widgets = useTypedSelector((state) => state.Widgets);

  const deselectWidget = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      dispatch(WidgetsServices.actions.setCurrent("NONE"));
    }
  };
  return (
    <div className="dashboard" onClick={deselectWidget}>
      {lectures.dict[lectures.current] &&
      lectures.dict[lectures.current].widgets.length > 0 ? (
        <div className="widgets" onClick={deselectWidget}>
          {lectures.dict[lectures.current].widgets.toReversed().map((wid) => {
            const w = widgets.dict[wid];
            return (
              <WidgetFrame
                key={wid}
                title={widgetBook[w.type].title}
                icon={widgetBook[w.type].icon}
                selected={wid === widgets.current}
                widgetId={wid}
                widgetType={widgets.dict[wid].type}
              />
            );
          })}
        </div>
      ) : (
        <DashboardPlaceHolder />
      )}

      <Chatroom
        context={
          widgets.dict[widgets.current]
            ? widgetBook[widgets.dict[widgets.current].type].title
            : ""
        }
      />
    </div>
  );
};

export default Dashboard;
