import {Plan, ResultDraft, WatsonHealthStatusChange} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type SemesterPlanWidgetContent = {
  headings: string[];
  rows: {[key: string]: string}[];
  name?: string;
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
      category: WidgetCategory.aiTool,
    };
  }
  promptRecs(): PromptItem[] {
    return [
      {
        chipMessage: "生成二十週的教學計畫草稿",
        actualPrompt: "生成二十週的學期進度，包含每週需要涵蓋的教材內容",
        icon: <ResultDraft />,
        iconColor: "#478CCF",
      },
      {
        chipMessage: "把第二週跟第四週的內容做交換",
        actualPrompt: "把第二週跟第四週的內容做交換",
        icon: <WatsonHealthStatusChange />,
        iconColor: "#B60071",
      },
    ];
  }
}
