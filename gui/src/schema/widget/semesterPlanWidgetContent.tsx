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
      headings: ["Week", "Course Unit", "Activity"],
      rows: [{Week: "", "Course Unit": "", Activity: ""}],
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
      title: "Semester Plan",
      hint: "Create semester plan",
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
        chipMessage: "Generate a twenty week teaching plan",
        actualPrompt: "Generate a twenty week semester plan",
        icon: <ResultDraft />,
        iconColor: "#478CCF",
      },
      {
        chipMessage: "Swap content between week two and week four",
        actualPrompt: "Swap content between week two and week four",
        icon: <WatsonHealthStatusChange />,
        iconColor: "#B60071",
      },
    ];
  }
}
