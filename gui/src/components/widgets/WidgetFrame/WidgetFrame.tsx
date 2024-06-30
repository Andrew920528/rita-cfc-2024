import React, {ReactElement, useState} from "react";
import {Catalog, Close} from "@carbon/icons-react";
import IconButton from "../../ui_components/IconButton/IconButton";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {WidgetType} from "../../../schema/widget";
import SemesterGoalWidget from "../SemesterGoalWidget/SemesterGoalWidget";
import SemesterPlanWidget from "../SemesterPlanWidget/SemesterPlanWidget";
import NoteWidget from "../NoteWidget/NoteWidget";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import {useDeleteWidget} from "../../../store/globalActions";
import {deleteWidgetService, useApiHandler} from "../../../utils/service";
import {API_ERROR} from "../../../utils/constants";
import classNames from "classnames/bind";
import styles from "./WidgetFrame.module.scss";

const cx = classNames.bind(styles);
const widgetComponent = (widgetId: string, widgetType: WidgetType) => {
  switch (widgetType) {
    case WidgetType.SemesterGoal:
      return <SemesterGoalWidget wid={widgetId} />;
    case WidgetType.SemesterPlan:
      return <SemesterPlanWidget wid={widgetId} />;
    case WidgetType.Schedule:
      return <ScheduleWidget wid={widgetId} />;
    case WidgetType.Note:
      return <NoteWidget wid={widgetId} />;
    default:
      return null;
  }
};

const widgetWidths = {
  [WidgetType.SemesterGoal]: "33",
  [WidgetType.SemesterPlan]: "66",
  [WidgetType.Schedule]: "33",
  [WidgetType.Note]: "33",
};
type WidgetFrameProps = {
  selected?: boolean;
  icon?: ReactElement;
  title?: string;
  widgetId: string;
  widgetType: WidgetType;
};
const WidgetFrame = ({
  selected,
  icon = <Catalog size={20} />,
  title = "Widget",
  widgetId,
  widgetType,
}: WidgetFrameProps) => {
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const deleteWidget = useDeleteWidget();
  const {apiHandler, loading} = useApiHandler();
  async function deleteWidgetAction() {
    let r = await apiHandler({
      apiFunction: (s) =>
        deleteWidgetService(s, {
          widgetId: widgetId,
          lectureId: lectures.current,
        }),
    });
    if (r.status === API_ERROR) {
      return;
    }
    deleteWidget({lectureId: lectures.current, widgetId: widgetId});
  }
  return (
    <div
      className={cx(
        "widget-frame",
        {
          selected: selected,
        },
        `w-${widgetWidths[widgetType]}`
      )}
      onClick={() => {
        dispatch(WidgetsServices.actions.setCurrent(widgetId));
      }}
    >
      <div className={cx("wf-heading")}>
        <div className={cx("wf-heading-left")}>
          {icon}
          <p className={cx("--heading")}>{title}</p>
        </div>
        <IconButton
          icon={<Close />}
          mode="ghost"
          onClick={async () => {
            await deleteWidgetAction();
          }}
          disabled={loading}
        />
      </div>
      <div className={cx("wf-content")}>
        {widgetComponent(widgetId, widgetType)}
      </div>
    </div>
  );
};

export default React.memo(WidgetFrame);
