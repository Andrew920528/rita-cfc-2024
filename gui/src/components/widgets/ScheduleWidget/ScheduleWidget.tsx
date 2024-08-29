import React from "react";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import Table from "../../ui_components/Table/Table";
import {
  Schedule,
  ScheduleHeadings,
  scheduleHeadings,
} from "../../../schema/schedule";
import {current} from "@reduxjs/toolkit";
import {UserServices} from "../../../features/UserSlice";
import IconButton from "../../ui_components/IconButton/IconButton";
import {Add, RowDelete, RowInsert, Subtract} from "@carbon/icons-react";
import classNames from "classnames/bind";
import styles from "./ScheduleWidget.module.scss";
import Skeleton from "@mui/material/Skeleton";
import {Widget} from "../../../schema/widget/widget";
import {WidgetContentProps} from "../WidgetFrame/WidgetFrame";

const cx = classNames.bind(styles);

const ScheduleWidget = ({
  widget,
  loading,
  preview = false,
}: WidgetContentProps) => {
  const dispatch = useAppDispatch();
  const schedule = useTypedSelector((state) => state.User.schedule);
  const widgetTableContent = schedule.map((row, rowIndex) =>
    Object.keys(row).reduce((acc: any, day: string) => {
      acc[day] = (
        <ScheduleCell
          value={schedule[rowIndex][day as ScheduleHeadings]}
          day={day as ScheduleHeadings}
          period={rowIndex}
        />
      );
      return acc;
    }, {})
  );

  return loading ? (
    <ScheduleSkeleton />
  ) : (
    <div className={cx("schedule-widget")}>
      <Table headings={scheduleHeadings} content={widgetTableContent} />
      <div className={cx("widget-button-row")}>
        <IconButton
          flex={false}
          icon={<Add />}
          mode={"primary"}
          onClick={() => {
            dispatch(UserServices.actions.updateSchedule("add"));
          }}
        />
        <IconButton
          flex={false}
          icon={<Subtract />}
          mode={"primary"}
          onClick={() => {
            dispatch(UserServices.actions.updateSchedule("delete"));
          }}
        />
      </div>
    </div>
  );
};

type ScheduleCellProps = {
  value: string;
  day: ScheduleHeadings;
  period: number;
};
const ScheduleCell = (props: ScheduleCellProps) => {
  const dispatch = useAppDispatch();
  const currentClass = useTypedSelector((state) => state.Classrooms.current);
  const classroom = useTypedSelector(
    (state) => state.Classrooms.dict[currentClass]
  );
  function setSchedule(day: ScheduleHeadings, period: number, value: string) {
    dispatch(
      UserServices.actions.updateScheduleCell({
        day: day,
        period: period,
        value: value,
      })
    );
  }
  return (
    <div
      className={cx("schedule-widget-cell", {
        locked: props.value !== "" && props.value !== classroom.name,
      })}
      onClick={() => {
        if (props.value !== "" && props.value !== classroom.name) {
          return;
        }
        if (props.value === "") {
          setSchedule(props.day, props.period, classroom.name);
        } else {
          setSchedule(props.day, props.period, "");
        }
      }}
    >
      {props.value}
    </div>
  );
};

const ScheduleSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      animation="wave"
      sx={{flexGrow: 1}}
    />
  );
};

export default ScheduleWidget;
