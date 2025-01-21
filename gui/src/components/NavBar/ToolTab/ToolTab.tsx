import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ToolTab.module.scss";
import {EMPTY_ID} from "../../../global/constants";
import {WidgetCategory, WidgetType} from "../../../schema/widget/widget";
import {widgetBook} from "../../../schema/widget/widgetFactory";
import WidgetCard from "../WidgetCard/WidgetCard";
import {useTypedSelector} from "../../../store/store";

import Accordion from "../../ui_components/Accordion/Accordion";
import {Lecture} from "../../../schema/lecture";
import {TText} from "../../TText/TText";

const cx = classNames.bind(styles);
type Props = {};

function validateWidgetCard(widgetType: WidgetType, lecture: Lecture) {
  let valid = true;
  if (widgetType === WidgetType.SemesterGoal) {
    if (lecture.semeterGoalId && lecture.semeterGoalId !== EMPTY_ID) {
      valid = false;
    }
  }

  return valid;
}

function ToolTab({}: Props) {
  const lectures = useTypedSelector((state) => state.Lectures);
  const toolKeys = Object.keys(
    WidgetCategory
  ) as (keyof typeof WidgetCategory)[];
  return (
    <div className={cx("nav-widget")}>
      {toolKeys.map((key) => {
        return (
          <Accordion
            id={`acc-${key}-open-status`}
            key={key}
            header={
              <div className={cx("nav-heading")}>
                <p className={cx("--heading")}>
                  <TText>{WidgetCategory[key]}</TText>
                </p>
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
                            disabled={
                              !validateWidgetCard(
                                w.type,
                                lectures.dict[lectures.current]
                              )
                            }
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
