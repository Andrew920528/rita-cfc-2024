import {Plan} from "@carbon/icons-react";
import {WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type SemesterPlanWidgetContent = {
  headings: string[];
  rows: {[key: string]: string}[];
};

export class SemesterPlanWidgetMaker extends WidgetMaker<SemesterPlanWidgetContent> {
  init() {
    return {
      headings: ["週目", "課程單元", "活動"],
      rows: [{週目: "", 課程單元: "", 活動: ""}],
    };
  }
  isType(obj: any): obj is SemesterPlanWidgetContent {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Array.isArray(obj.headings) &&
      obj.headings.every((heading: any) => typeof heading === "string") &&
      Array.isArray(obj.rows) &&
      obj.rows.every(
        (row: any) =>
          typeof row === "object" &&
          row !== null &&
          Object.values(row).every((value) => typeof value === "string")
      )
    );
  }
  uiBook() {
    return {
      title: "進度表",
      hint: "製作學期進度",
      icon: <Plan />,
      type: WidgetType.SemesterPlan,
      minWidth: 700,
      maxWidth: 5000,
      minHeight: 300,
      maxHeight: 800,
    };
  }
}
