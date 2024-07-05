import {Alarm, Catalog, CertificateCheck, Plan} from "@carbon/icons-react";
import {Schedule} from "./schedule";

export type WidgetContent =
  | SemesterGoalWidgetContent
  | SemesterPlanWidgetContent
  | NoteWidgetContent
  | ScheduleWidgetContent;

export type Widget = {
  id: string;
  type: WidgetType;
  content: WidgetContent;
};

export type Widgets = {
  dict: {[key: string]: Widget};
  current: string;
  unsaved: {[key: string]: true};
};

export type SemesterGoalWidgetContent = {
  goals: string[];
};

export type SemesterPlanWidgetContent = {
  headings: string[];
  rows: {[key: string]: string}[];
};
export type NoteWidgetContent = {
  note: string;
};
export type ScheduleWidgetContent = {}; // currently content comes from user

export enum WidgetType {
  SemesterGoal,
  SemesterPlan,
  Note,
  Schedule,
}

export function initWidget(id: string, type: WidgetType): Widget {
  switch (type) {
    case WidgetType.SemesterGoal: // semester goal
      return {
        id: id,
        type: type,
        content: {goals: []} as SemesterGoalWidgetContent,
      };
    case WidgetType.SemesterPlan: // semester plan
      return {
        id: id,
        type: type,
        content: {
          headings: ["週目", "目標", "教材"],
          rows: [
            {週目: "1", 目標: "基本的な漢字の習得", 教材: "漢字ドリル第1章"}, // FIXME: testing purposes
          ],
        } as SemesterPlanWidgetContent,
      };
    case WidgetType.Note: // note
      return {
        id: id,
        type: type,
        content: {note: ""} as NoteWidgetContent,
      };
    case WidgetType.Schedule: // schedule
      return {
        id: id,
        type: type,
        content: {} as ScheduleWidgetContent,
      };
    default:
      return {
        id,
        type,
        content: {},
      };
  }
}

export const widgetBook = {
  [WidgetType.SemesterGoal]: {
    title: "學習目標",
    hint: "列出學習重點",
    icon: <CertificateCheck />,
    type: WidgetType.SemesterGoal,
  },
  [WidgetType.SemesterPlan]: {
    title: "進度表",
    hint: "製作學期進度",
    icon: <Plan />,
    type: WidgetType.SemesterPlan,
  },
  [WidgetType.Note]: {
    title: "筆記",
    hint: "快速整理想法",
    icon: <Catalog />,
    type: WidgetType.Note,
  },
  [WidgetType.Schedule]: {
    title: "課表",
    hint: "瀏覽每週課表",
    icon: <Alarm />,
    type: WidgetType.Schedule,
  },
};

// Type guards
function isSemesterGoalWidgetContent(
  obj: any
): obj is SemesterGoalWidgetContent {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Array.isArray(obj.goals) &&
    obj.goals.every((goal: any) => typeof goal === "string")
  );
}

export function isSemesterPlanWidgetContent(
  obj: any
): obj is SemesterPlanWidgetContent {
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

export function isNoteWidgetContent(obj: any): obj is NoteWidgetContent {
  return (
    typeof obj === "object" && obj !== null && typeof obj.note === "string"
  );
}

export function contentIsOfType(type: WidgetType, content: any) {
  switch (type) {
    case WidgetType.SemesterGoal:
      return isSemesterGoalWidgetContent(content);
    case WidgetType.SemesterPlan:
      return isSemesterPlanWidgetContent(content);
    case WidgetType.Note:
      return isNoteWidgetContent(content);
    case WidgetType.Schedule:
      console.log("Schedule update is not implemented yet");
      return true;
    default:
      return false;
  }
}
