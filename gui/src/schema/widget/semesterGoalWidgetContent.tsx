import {CertificateCheck} from "@carbon/icons-react";
import {WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

// Defines the content properties
export type SemesterGoalWidgetContent = {
  goals: string[];
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
      obj.goals.every((goal: any) => typeof goal === "string")
    );
  }
  uiBook() {
    return {
      title: "學習目標",
      hint: "列出學習重點",
      icon: <CertificateCheck />,
      type: WidgetType.SemesterGoal,
      minWidth: 300,
      maxWidth: 600,
      minHeight: 200,
      maxHeight: 500,
      category: WidgetCategory.contextSetter,
    };
  }
}
