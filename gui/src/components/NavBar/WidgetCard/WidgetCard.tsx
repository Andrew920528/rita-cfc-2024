import {Information, Add} from "@carbon/icons-react";

import {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {API, EMPTY_ID} from "../../../global/constants";
import {WidgetType, initWidget, widgetBook} from "../../../schema/widget";
import {useCreateWidget, useDeleteWidget} from "../../../store/globalActions";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {useApiHandler, createWidgetService} from "../../../utils/service";
import {delay, generateId} from "../../../utils/util";
import IconButton from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./WidgetCard.module.scss";
import {WidgetFrameGhost} from "../../widgets/WidgetFrame/WidgetFrame";
import {UiServices} from "../../../features/UiSlice";

const cx = classNames.bind(styles);

const WidgetDragImage = () => {
  return (
    <div className="widget">
      <p>Dragging...</p>
    </div>
  );
}; // CustomDragImage

type WidgetCardProps = {
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
};

const WidgetCard = ({icon, title, hint, widgetType}: WidgetCardProps) => {
  const {createWidget, loading} = useCreateWidgetWithApi();
  const ui = useTypedSelector((state) => state.Ui);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragImageRef.current) {
      dragImageRef.current.style.display = "block";
      let offsetX = widgetBook[widgetType].width / 2;
      let offsetY = widgetBook[widgetType].minHeight / 2;
      e.dataTransfer.setDragImage(dragImageRef.current, offsetX, offsetY);
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", widgetType.toString());
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Skip events when dragging out of bounds
  };

  const handleDragEnd = () => {
    if (dragImageRef.current) {
      dragImageRef.current.style.display = "none";
    }
  };
  const dragImageRef = useRef<HTMLDivElement>(null);

  // Update position on mouse move

  return (
    <div
      draggable
      className={cx("widget-card")}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className={cx("widget-card-left")}>
        {icon}
        <p>
          <strong>{title}</strong>
        </p>
        <p className={cx("--label")}>{hint}</p>
      </div>
      <div className={cx("widget-card-right")}>
        <IconButton mode={"ghost"} icon={<Information />} />
        <IconButton
          mode={"primary"}
          icon={<Add />}
          onClick={async () => {
            await createWidget(widgetType);
          }}
          disabled={loading}
        />
      </div>
      <div
        ref={dragImageRef}
        style={{
          position: "fixed",
          top: -1000,
          left: -1000,
          display: "block",
          opacity: 0.5,
        }}
      >
        <WidgetFrameGhost widgetType={widgetType} />
      </div>
    </div>
  );
};

export default WidgetCard;

// create widgethook - used in Flow and Dashboard for drag and drop
// TODO: wondering if there are better way to organize the code (maybe in Dashboard? Global action?)
export const useCreateWidgetWithApi = () => {
  const lectures = useTypedSelector((state) => state.Lectures);
  const username = useTypedSelector((state) => state.User.username);
  const deleteWidget = useDeleteWidget();
  const addWidget = useCreateWidget();
  const {apiHandler, loading} = useApiHandler();

  async function createWidget(widgetType: WidgetType) {
    const newWidgetId = username + "-wid-" + generateId();
    addWidget({
      widgetType: widgetType,
      lectureId: lectures.current,
      widgetId: newWidgetId,
    });
    let r = await apiHandler({
      apiFunction: (s) =>
        createWidgetService(
          {
            widgetId: newWidgetId,
            type: widgetType,
            lectureId: lectures.current,
            content: JSON.stringify(
              initWidget(newWidgetId, widgetType).content
            ),
          },
          s
        ),
      debug: true,
      identifier: "createWidget",
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      // If api fails, delete widget from store
      // TODO: toast error
      deleteWidget({lectureId: lectures.current, widgetId: newWidgetId});
      return EMPTY_ID;
    }

    return newWidgetId;
  }
  return {
    createWidget: useCallback(createWidget, [
      lectures,
      username,
      addWidget,
      apiHandler,
    ]),
    loading: loading,
  };
};
