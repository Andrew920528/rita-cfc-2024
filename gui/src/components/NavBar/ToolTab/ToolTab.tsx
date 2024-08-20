import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ToolTab.module.scss";
import {EMPTY_ID} from "../../../global/constants";
import {WidgetCategory, WidgetType} from "../../../schema/widget/widget";
import {widgetBook} from "../../../schema/widget/widgetFactory";
import WidgetCard from "../WidgetCard/WidgetCard";
import {useTypedSelector} from "../../../store/store";
import IconButton from "../../ui_components/IconButton/IconButton";
import {ArrowUp, ChevronUp} from "@carbon/icons-react";
import Accordion from "../../ui_components/Accordion/Accordion";

const cx = classNames.bind(styles);
type Props = {};

function ToolTab({}: Props) {
  const lectures = useTypedSelector((state) => state.Lectures);
  const categories = {};
  const toolKeys = Object.keys(
    WidgetCategory
  ) as (keyof typeof WidgetCategory)[];
  console.log(toolKeys);
  return (
    <div className={cx("nav-widget")}>
      {toolKeys.map((key) => {
        return (
          <Accordion
            id={`acc-${key}-open-status`}
            key={key}
            header={
              <div className={cx("nav-heading")}>
                <p className={cx("--heading")}>{WidgetCategory[key]}</p>
              </div>
            }
            content={
              <>
                {lectures.current !== EMPTY_ID && (
                  <div className={cx("nav-stack")}>
                    {Object.values(WidgetType)
                      .filter((type) => {
                        if (isNaN(Number(type))) {
                          return false;
                        }
                        let w = widgetBook(type as WidgetType);
                        console.log(w.category);
                        return (
                          w.category === (WidgetCategory[key] as WidgetCategory)
                        );
                      })
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
              </>
            }
          />
        );
      })}
    </div>
  );
}

export default React.memo(ToolTab);
