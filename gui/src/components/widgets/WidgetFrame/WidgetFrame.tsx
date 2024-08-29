import React, {ReactElement, useEffect, useState} from "react";
import {Close} from "@carbon/icons-react";
import IconButton from "../../ui_components/IconButton/IconButton";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {Widget, WidgetContent, WidgetType} from "../../../schema/widget/widget";
import {widgetBook} from "../../../schema/widget/widgetFactory";
import SemesterGoalWidget from "../SemesterGoalWidget/SemesterGoalWidget";
import SemesterPlanWidget from "../SemesterPlanWidget/SemesterPlanWidget";
import NoteWidget from "../NoteWidget/NoteWidget";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import {useDeleteWidget} from "../../../global/globalActions";
import {deleteWidgetService, useApiHandler} from "../../../utils/service";
import {API} from "../../../global/constants";
import classNames from "classnames/bind";
import styles from "./WidgetFrame.module.scss";
import {delay} from "../../../utils/util";
import WorksheetWidget from "../WorksheetWidget/WorksheetWidget";
import {CircularProgress} from "@mui/material";

const cx = classNames.bind(styles);
const widgetComponent = (widget: Widget) => {
  let loading = false;
  let widgetType = widget.type;
  switch (widgetType) {
    case WidgetType.SemesterGoal:
      return <SemesterGoalWidget widget={widget} loading={loading} />;
    case WidgetType.SemesterPlan:
      return <SemesterPlanWidget widget={widget} loading={loading} />;
    case WidgetType.Schedule:
      return <ScheduleWidget widget={widget} loading={loading} />;
    case WidgetType.Note:
      return <NoteWidget widget={widget} loading={loading} />;
    case WidgetType.Worksheet:
      return <WorksheetWidget widget={widget} loading={loading} />;
    default:
      return null;
  }
};

export type WidgetFrameProps = {
  selected?: boolean;
  widget: Widget;
};
const WidgetFrame = ({selected, widget}: WidgetFrameProps) => {
  const dispatch = useAppDispatch();
  const lectures = useTypedSelector((state) => state.Lectures);
  const widgets = useTypedSelector((state) => state.Widgets);
  const draggingNodeId = useTypedSelector((state) => state.Rf.draggingNodeId);

  const deleteWidget = useDeleteWidget();
  const {apiHandler, loading} = useApiHandler();
  const apiSignals = useTypedSelector((state) => state.Widgets.creating);

  async function deleteWidgetAction() {
    setIsExiting(true);
    await delay(100); // wait for exit animation
    deleteWidget({lectureId: lectures.current, widgetId: widget.id});
    let r = await apiHandler({
      apiFunction: () =>
        deleteWidgetService({
          widgetId: widget.id,
          lectureId: lectures.current,
        }),
      debug: true,
      identifier: "deleteWidget",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      return;
    }
  }
  const widgetType = widget.type;
  const title = widgetBook(widgetType).title;
  const icon = widgetBook(widgetType).icon;

  // handle animation
  const [isExiting, setIsExiting] = useState(false);
  return (
    <div
      className={cx("widget-frame", {
        selected: selected,
        dragging: draggingNodeId === widget.id,
        exiting: isExiting,
        entering: !isExiting,
      })}
      style={{
        minWidth: widgetBook(widgetType).minWidth,
        maxWidth: widgetBook(widgetType).maxWidth,
        minHeight: widgetBook(widgetType).minHeight,
        maxHeight: widgetBook(widgetType).maxHeight,
      }}
      onClick={() => {
        dispatch(WidgetsServices.actions.setCurrent(widget.id));
      }}
    >
      <div className={cx("wf-heading")}>
        <div className={cx("wf-heading-left")}>
          {icon}
          <p className={cx("--heading")}>{title}</p>
        </div>
        <IconButton
          icon={
            Object.keys(apiSignals).includes(widget.id) ? (
              <CircularProgress color="inherit" size={12} />
            ) : (
              <Close />
            )
          }
          mode="ghost"
          onClick={async () => {
            await deleteWidgetAction();
          }}
          disabled={loading || Object.keys(apiSignals).includes(widget.id)}
        />
      </div>
      <div className={cx("wf-content")}>{widgetComponent(widget)}</div>
      <div className={cx("draggable-area")} />
    </div>
  );
};

export const WidgetFrameGhost = ({widgetType}: {widgetType: WidgetType}) => {
  const title = widgetBook(widgetType).title;
  const icon = widgetBook(widgetType).icon;

  return (
    <div
      className={cx("widget-frame")}
      style={{
        minWidth: widgetBook(widgetType).minWidth,
        maxWidth: widgetBook(widgetType).maxWidth,
        minHeight: widgetBook(widgetType).minHeight,
        maxHeight: widgetBook(widgetType).maxHeight,
      }}
    >
      <div className={cx("wf-heading")}>
        <div className={cx("wf-heading-left")}>
          {icon}
          <p className={cx("--heading")}>{title}</p>
        </div>
        <IconButton icon={<Close />} mode="ghost" />
      </div>
      <div className={cx("wf-content")}>
        {/* {widgetComponent(widgetId, widgetType)} */}
      </div>
      <div className={cx("draggable-area")} />
    </div>
  );
};

export const WidgetFramePreview = ({
  widgetType,
  widgetContent,
}: {
  widgetType: WidgetType;
  widgetContent: WidgetContent;
}) => {
  const title = widgetBook(widgetType).title;
  const icon = widgetBook(widgetType).icon;
  return (
    <div
      className={cx("widget-frame")}
      // style={{
      //   minWidth: widgetBook(widgetType).minWidth,
      //   maxWidth: widgetBook(widgetType).maxWidth,
      //   minHeight: widgetBook(widgetType).minHeight,
      //   maxHeight: widgetBook(widgetType).maxHeight,
      // }}
    >
      <div className={cx("wf-heading")}>
        <div className={cx("wf-heading-left")}>
          {icon}
          <p className={cx("--heading")}>{title}</p>
        </div>
      </div>
      <div className={cx("wf-content")}>
        {/* {widgetComponent(widgetId, widgetType)} */}
      </div>
      <div className={cx("draggable-area")} />
    </div>
  );
};

export default React.memo(WidgetFrame);
