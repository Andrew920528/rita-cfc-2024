import React from "react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import Table from "../ui_components/Table";
import {
  Schedule,
  ScheduleHeadings,
  scheduleHeadings,
} from "../../schema/schedule";
import {current} from "@reduxjs/toolkit";
import {UserServices} from "../../features/UserSlice";
import IconButton from "../ui_components/IconButton";
import {Add, RowDelete, RowInsert, Subtract} from "@carbon/icons-react";

type Props = {
  wid: string;
};

const ScheduleWidget = (props: Props) => {
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

  return (
    <div className="schedule-widget">
      <Table headings={scheduleHeadings} content={widgetTableContent} />
      <div className="widget-button-row">
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
      className={`schedule-widget-cell ${
        props.value !== "" && props.value !== classroom.name ? "locked" : ""
      }`}
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

export default ScheduleWidget;
