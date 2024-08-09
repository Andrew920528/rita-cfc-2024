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
      headings: ["課程", "教材", "重點"],
      rows: [{課程: "輸入課程", 教材: "輸入教材", 重點: "輸入重點"}],
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
