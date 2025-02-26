import {CertificateCheck, TableOfContents} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

// Defines the content properties
export type SemesterGoalWidgetContent = {
  goals: string[];
  start?: string;
  end?: string;
  semesterPlanRef?: string;
};

// Set of methods that define the widget
export class SemesterGoalWidgetMaker extends WidgetMaker<SemesterGoalWidgetContent> {
  init() {
    return {
      goals: [],
    };
  }
  isType(obj: any): obj is SemesterGoalWidgetContent {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Array.isArray(obj.goals) &&
      obj.goals.every((goal: any) => typeof goal === "string") &&
      (obj.start === undefined || typeof obj.start === "string") &&
      (obj.end === undefined || typeof obj.end === "string") &&
      (obj.semesterPlanRef === undefined ||
        typeof obj.semesterPlanRef === "string")
    );
  }
  uiBook() {
    return {
      title: "Learning Objectives",
      hint: "List out key learning objectives",
      icon: <CertificateCheck />,
      type: WidgetType.SemesterGoal,
      minWidth: 300,
      maxWidth: 600,
      minHeight: 200,
      maxHeight: 500,
      category: WidgetCategory.contextSetter,
    };
  }
  promptRecs(): PromptItem[] {
    return [
      {
        chipMessage: "List key points for the third unit",
        actualPrompt: "List key points for the third unit",
        icon: <TableOfContents />,
        iconColor: "#B60071",
      },
    ];
  }
}
