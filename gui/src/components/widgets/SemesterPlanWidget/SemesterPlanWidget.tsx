import React, {useCallback, useEffect, useState} from "react";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {
  SemesterPlanWidgetContent,
  Widget,
  WidgetType,
} from "../../../schema/widget";
import Table from "../../ui_components/Table/Table";
import Textbox from "../../ui_components/Textbox/Textbox";
import IconButton from "../../ui_components/IconButton/IconButton";
import {
  ColumnDelete,
  ColumnInsert,
  RowDelete,
  RowInsert,
  Settings,
} from "@carbon/icons-react";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import classNames from "classnames/bind";
import styles from "./SemesterPlanWidget.module.scss";
import {Skeleton} from "@mui/material";
import {useWidgetLoading} from "../../../features/UiSlice";

const cx = classNames.bind(styles);
type Props = {
  wid: string;
};

const SemesterPlanWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
  const widgetContent = widget.content as SemesterPlanWidgetContent;
  function addColumn(table: SemesterPlanWidgetContent, newHeading: string) {
    const originalTable = structuredClone(table);
    // inspect the original table and add new column with unique name
    let counter = 0;
    for (let heading of originalTable.headings) {
      if (heading.split("(")[0] === newHeading) {
        counter++;
      }
    }
    if (counter > 0) {
      newHeading = newHeading + "(" + counter + ")";
    }

    originalTable.headings.push(newHeading);
    originalTable.rows.forEach((row: any) => {
      row[newHeading] = "";
    });
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: {
          id: props.wid,
          type: WidgetType.SemesterPlan,
          content: originalTable,
        },
      })
    );
  }

  function deleteColumn(table: SemesterPlanWidgetContent, heading: string) {
    const originalTable = structuredClone(table);
    originalTable.headings = originalTable.headings.filter(
      (h: string) => h !== heading
    );
    originalTable.rows.forEach((row: any) => {
      delete row[heading];
    });
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: {
          id: props.wid,
          type: WidgetType.SemesterPlan,
          content: originalTable,
        },
      })
    );
  }

  function setCell(
    table: SemesterPlanWidgetContent,
    heading: string,
    row: number,
    value: string
  ) {
    const originalTable = structuredClone(table);
    originalTable.rows[row][heading] = value;
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: {
          id: props.wid,
          type: WidgetType.SemesterPlan,
          content: originalTable,
        },
      })
    );
  }

  function insertRow(table: SemesterPlanWidgetContent, row: number) {
    const originalTable = structuredClone(table);
    const initObj = originalTable.headings.reduce((acc: any, key: string) => {
      acc[key] = "";
      return acc;
    }, {});

    originalTable.rows = [
      ...originalTable.rows.slice(0, row),
      initObj,
      ...originalTable.rows.slice(row),
    ];
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: {
          id: props.wid,
          type: WidgetType.SemesterPlan,
          content: originalTable,
        },
      })
    );
  }

  function deleteRow(table: SemesterPlanWidgetContent, row: number) {
    const originalTable = structuredClone(table);

    originalTable.rows.pop();
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: {
          id: props.wid,
          type: WidgetType.SemesterPlan,
          content: originalTable,
        },
      })
    );
  }

  const widgetTableContent = widgetContent.rows.map((row, rowIndex) =>
    Object.keys(row).reduce((acc: any, key: string) => {
      acc[key] = (
        <SemesterPlanCell
          data={row[key as keyof typeof row]}
          onClick={() => {
            // console.log(key, row[key]);
          }}
          onChange={(newValue) => {
            setCell(widgetContent, key, rowIndex, newValue);
          }}
        />
      );
      return acc;
    }, {})
  );
  const loading = useWidgetLoading(props.wid);
  return loading ? (
    <SemesterPlanSkeleton />
  ) : (
    <div className={cx("semester-plan-widget")}>
      <Table headings={widgetContent.headings} content={widgetTableContent} />
      <div className={cx("widget-button-row")}>
        <IconButton
          flex={true}
          text={"Add Column"}
          icon={<ColumnInsert />}
          mode={"primary"}
          onClick={() => {
            addColumn(widgetContent, "新しいカラム");
          }}
        />
        <IconButton
          flex={true}
          text={"Delete Column"}
          icon={<ColumnDelete />}
          mode={"primary"}
          onClick={() => {
            deleteColumn(
              widgetContent,
              widgetContent.headings[widgetContent.headings.length - 1]
            );
          }}
        />
        <IconButton
          flex={true}
          text={"Add row"}
          icon={<RowInsert />}
          mode={"primary"}
          onClick={() => {
            insertRow(widgetContent, widgetContent.rows.length);
          }}
        />
        <IconButton
          flex={true}
          text={"Delete row"}
          icon={<RowDelete />}
          mode={"primary"}
          onClick={() => {
            deleteRow(widgetContent, widgetContent.rows.length - 1);
          }}
        />
      </div>
    </div>
  );
};

type SemesterPlanCellProps = {
  data: any;
  locked?: boolean;
  onClick: () => void;
  onChange: (s: string) => void;
};
const SemesterPlanCell = ({
  data,
  onClick,
  locked = false,
  onChange,
}: SemesterPlanCellProps) => {
  return (
    <div
      onClick={() => {
        onClick();
      }}
    >
      <Textbox
        flex={true}
        mode="table"
        value={data}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        ariaLabel="semester plan cell"
      />
    </div>
  );
};

const SemesterPlanSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      animation="wave"
      sx={{flexGrow: 1}}
    />
  );
};

export default SemesterPlanWidget;
