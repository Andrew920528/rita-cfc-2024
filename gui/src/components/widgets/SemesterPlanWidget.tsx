import React, {useEffect, useState} from "react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {SemesterPlanWidgetT} from "../../schema/widget";
import Table from "../ui_components/Table";
import Textbox from "../ui_components/Textbox";
import IconButton from "../ui_components/IconButton";
import {Settings} from "@carbon/icons-react";
import {WidgetsServices} from "../../features/WidgetsSlice";

type Props = {
  wid: string;
};

const SemesterPlanWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const widgets = useTypedSelector((state) => state.Widgets);
  const [widget, setWidget] = useState<SemesterPlanWidgetT>(
    widgets.dict[props.wid] as SemesterPlanWidgetT
  );

  useEffect(() => {
    dispatch(
      WidgetsServices.actions.updateWidget({
        wid: props.wid,
        newWidget: widget,
      })
    );
  }, [widget]);

  function addColumn(table: any, newHeading: string) {
    const originalTable = structuredClone(table);
    // inspect the original table and add new column with unique name
    let counter = 1;
    for (let heading of originalTable.headings) {
      if (heading.split("(")[0] === newHeading) {
        counter++;
      }
    }
    newHeading = newHeading + "(" + counter + ")";

    originalTable.headings.push(newHeading);
    originalTable.content.forEach((row: any) => {
      row[newHeading] = "";
    });
    setWidget(originalTable);
  }

  function deleteColumn(table: any, heading: string) {
    const originalTable = structuredClone(table);
    originalTable.headings = originalTable.headings.filter(
      (h: string) => h !== heading
    );

    originalTable.content.forEach((row: any) => {
      delete row[heading];
    });
    setWidget(originalTable);
  }

  function setCell(table: any, heading: string, row: number, value: string) {
    const originalTable = structuredClone(table);
    originalTable.content[row][heading] = value;
    setWidget(originalTable);
  }
  const widgetTableContent = widget.content.map((row, rowIndex) =>
    Object.keys(row).reduce((acc: any, key: string) => {
      acc[key] = (
        <SemesterPlanCell
          data={row[key as keyof typeof row]}
          onClick={() => {
            // console.log(key, row[key]);
          }}
          onChange={(newValue) => {
            setCell(widget, key, rowIndex, newValue);
          }}
        />
      );
      return acc;
    }, {})
  );

  return (
    <div className="semester-plan-widget">
      <Table headings={widget.headings} content={widgetTableContent} />
      <IconButton
        flex={true}
        text={"Add"}
        icon={<Settings />}
        mode={"primary"}
        onClick={() => {
          addColumn(widget, "新しいカラム");
        }}
      />
      <IconButton
        flex={true}
        text={"Delete"}
        icon={<Settings />}
        mode={"primary"}
        onClick={() => {
          deleteColumn(widget, widget.headings[widget.headings.length - 1]);
        }}
      />
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
      />
    </div>
  );
};

export default SemesterPlanWidget;
