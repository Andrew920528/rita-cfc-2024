import React from "react";
import classNames from "classnames/bind";
import styles from "./ToolTab.module.scss";
import {EMPTY_ID} from "../../../global/constants";
import {WidgetType} from "../../../schema/widget/widget";
import {widgetBook} from "../../../schema/widget/widgetFactory";
import WidgetCard from "../WidgetCard/WidgetCard";
import {useTypedSelector} from "../../../store/store";
const cx = classNames.bind(styles);
type Props = {};

function ToolTab({}: Props) {
  const lectures = useTypedSelector((state) => state.Lectures);
  return (
    <div className={cx("nav-widget")}>
      <div className={cx("nav-heading")}>
        <p className={cx("--heading")}>工具</p>
      </div>
      {lectures.current !== EMPTY_ID && (
        <div className={cx("nav-stack")}>
          {Object.values(WidgetType)
            .filter((key) => !isNaN(Number(key)))
            .map((type) => {
              let w = widgetBook(type as WidgetType);
              return (
                <WidgetCard
                  key={w.title}
                  title={w.title}
                  hint={w.hint}
                  icon={w.icon}
                  widgetType={w.type}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default ToolTab;
