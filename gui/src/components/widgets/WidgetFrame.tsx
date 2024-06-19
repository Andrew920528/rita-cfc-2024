import React, {ReactElement} from "react";
import {Catalog, Close} from "@carbon/icons-react";
import IconButton from "../ui_components/IconButton";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {LecturesServices} from "../../features/LectureSlice";
import {WidgetType} from "../../schema/widget";
import SemesterGoalWidget from "./SemesterGoalWidget";
import SemesterPlanWidget from "./SemesterPlanWidget";
import NoteWidget from "./NoteWidget";
import ScheduleWidget from "./ScheduleWidget";

type WidgetFrameProps = {
  selected?: boolean;
  icon?: ReactElement;
  title?: string;
  widgetId: string;
};
const WidgetFrame = ({
  selected,
  icon = <Catalog size={20} />,
  title = "Widget",
  widgetId,
}: WidgetFrameProps) => {
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const widgets = useTypedSelector((state) => state.Widgets);
  function deleteWidget() {
    dispatch(WidgetsServices.actions.deleteWidget(widgetId));
    dispatch(WidgetsServices.actions.setCurrent("NONE"));
    dispatch(
      LecturesServices.actions.deleteWidget({
        lectureId: lectures.current,
        widgetId: widgetId,
      })
    );
  }
  const widgetComponent = {
    [WidgetType.SemesterGoal]: <SemesterGoalWidget wid={widgetId} />,
    [WidgetType.SemesterPlan]: <SemesterPlanWidget wid={widgetId} />,
    [WidgetType.Note]: <NoteWidget wid={widgetId} />,
    [WidgetType.Schedule]: <ScheduleWidget wid={widgetId} />,
  };
  return (
    <div
      className={`widget-frame ${selected ? "selected" : "idle"}`}
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
            deleteWidget();
          }}
        />
      </div>
      <div className="wf-content">
        {widgetComponent[widgets.dict[widgetId].type]}
      </div>
    </div>
  );
};

export default WidgetFrame;
