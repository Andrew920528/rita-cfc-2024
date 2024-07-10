import {Information, Add} from "@carbon/icons-react";

import {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {API, EMPTY_ID} from "../../../global/constants";
import {WidgetType, initWidget, widgetBook} from "../../../schema/widget";
import {
  useCreateWidget,
  useCreateWidgetWithApi,
  useDeleteWidget,
} from "../../../global/globalActions";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {useApiHandler, createWidgetService} from "../../../utils/service";
import {delay, generateId} from "../../../utils/util";
import IconButton from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./WidgetCard.module.scss";
import {WidgetFrameGhost} from "../../widgets/WidgetFrame/WidgetFrame";
import {UiServices} from "../../../features/UiSlice";
import {RfServices} from "../../../features/RfSlice";

const cx = classNames.bind(styles);

type WidgetCardProps = {
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
};

const WidgetCard = ({icon, title, hint, widgetType}: WidgetCardProps) => {
  const {createWidget} = useCreateWidgetWithApi();
  const ui = useTypedSelector((state) => state.Ui);
  const dispatch = useAppDispatch();
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragImageRef.current) {
      dragImageRef.current.style.display = "block";

      let offsetX = e.clientX - e.currentTarget.getBoundingClientRect().x;
      let offsetY = e.clientY - e.currentTarget.getBoundingClientRect().y;
      dispatch(UiServices.actions.setDragOffset({x: offsetX, y: offsetY}));
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
        />
      </div>
      <div ref={dragImageRef} className={cx("card-ghost")}>
        <WidgetFrameGhost widgetType={widgetType} />
      </div>
    </div>
  );
};

export default WidgetCard;
