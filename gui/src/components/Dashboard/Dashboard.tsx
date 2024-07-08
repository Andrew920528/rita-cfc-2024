import React, {useEffect, useState} from "react";
import {Cafe} from "@carbon/icons-react";
import Chatroom from "../Chatroom/Chatroom";
import WidgetFrame from "../widgets/WidgetFrame/WidgetFrame";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {widgetBook} from "../../schema/widget";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {EMPTY_ID} from "../../global/constants";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import Playground from "./Playground";

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
  const widgets = useTypedSelector((state) => state.Widgets);

  const deselectWidget = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      // handle
      dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
    }
  };
  return (
    <div className={cx("dashboard")} onClick={deselectWidget}>
      {lectures.dict[lectures.current] &&
      lectures.dict[lectures.current].widgetIds.length > 0 ? (
        // <div className={cx("widgets")} onClick={deselectWidget}>
        //   {lectures.dict[lectures.current].widgetIds.toReversed().map((wid) => {
        //     return (
        //       <WidgetFrame
        //         key={wid}
        //         selected={wid === widgets.current}
        //         widgetId={wid}
        //       />
        //     );
        //   })}
        // </div>
        <Playground />
      ) : (
        <DashboardPlaceHolder />
      )}

      <Chatroom />
    </div>
  );
};

export default Dashboard;
