import React, {ReactElement, useState} from "react";
import {Catalog, Close} from "@carbon/icons-react";
import IconButton from "../ui_components/IconButton";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {WidgetType} from "../../schema/widget";
import SemesterGoalWidget from "./SemesterGoalWidget";
import SemesterPlanWidget from "./SemesterPlanWidget";
import NoteWidget from "./NoteWidget";
import ScheduleWidget from "./ScheduleWidget";
import {useDeleteWidget} from "../../store/globalActions";
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
  [WidgetType.SemesterGoal]: "25",
  [WidgetType.SemesterPlan]: "75",
  [WidgetType.Schedule]: "50",
  [WidgetType.Note]: "25",
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
  return (
    <div
      className={`widget-frame ${selected ? "selected" : "idle"} w-${
        widgetWidths[widgetType]
      }`}
      onClick={() => {
        dispatch(WidgetsServices.actions.setCurrent(widgetId));
      }}
    >
      <div className="wf-heading">
        <div className="wf-heading-left">
          {icon}
          <p className="--heading">{title}</p>
        </div>
        <IconButton
          icon={<Close />}
          mode="ghost"
          onClick={() => {
            deleteWidget({lectureId: lectures.current, widgetId: widgetId});
          }}
        />
      </div>
      <div className="wf-content">{widgetComponent(widgetId, widgetType)}</div>
    </div>
  );
};

export default React.memo(WidgetFrame);
