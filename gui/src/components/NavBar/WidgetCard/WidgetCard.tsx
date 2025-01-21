import {Information, Add} from "@carbon/icons-react";

import {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {WidgetType} from "../../../schema/widget/widget";

import {useCreateWidgetWithApi} from "../../../global/globalActions";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import IconButton from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./WidgetCard.module.scss";
import {WidgetFrameGhost} from "../../widgets/WidgetFrame/WidgetFrame";
import {UiServices} from "../../../features/UiSlice";
import React from "react";
import {TText} from "../../TText/TText";

const cx = classNames.bind(styles);

type WidgetCardProps = {
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
  disabled: boolean;
};

const WidgetCard = ({
  icon,
  title,
  hint,
  widgetType,
  disabled,
}: WidgetCardProps) => {
  const {createWidget} = useCreateWidgetWithApi();
  const dispatch = useAppDispatch();
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
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
    if (disabled) return;
    if (e.clientX === 0 && e.clientY === 0) return; // Skip events when dragging out of bounds
  };

  const handleDragEnd = () => {
    if (disabled) return;
    if (dragImageRef.current) {
      dragImageRef.current.style.display = "none";
    }
  };
  const dragImageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      draggable={!disabled}
      className={cx("widget-card", {disabled})}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className={cx("widget-card-left")}>
        {icon}
        <p>
          <strong>{title}</strong>
        </p>
        <p className={cx("--label")}>
          <TText>{hint}</TText>
        </p>
      </div>
      <div className={cx("widget-card-right")}>
        <IconButton mode={"ghost"} icon={<Information />} />
        <IconButton
          mode={"primary"}
          icon={<Add />}
          onClick={async () => {
            if (disabled) return;
            await createWidget(widgetType);
          }}
          disabled={disabled}
        />
      </div>
      <div ref={dragImageRef} className={cx("card-ghost")}>
        <WidgetFrameGhost widgetType={widgetType} />
      </div>
    </div>
  );
};

export default React.memo(WidgetCard);
