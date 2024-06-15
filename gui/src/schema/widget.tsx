import {Alarm, Catalog, CertificateCheck, Plan} from "@carbon/icons-react";

export type Widget = {
  id: string;
  type: WidgetType;
};

export type Widgets = {
  dict: {[key: string]: Widget};
  current: string;
};

export type SemesterGoalWidget = Widget & {
  content: string;
};
export type SemesterPlanWidget = Widget & {
  headings: string[];
  content: {
    [key: string]: string[];
  };
};
export type NoteWidget = Widget & {
  content: string;
};
export type ScheduleWidget = Widget & {
  headings: ["mon", "tue", "wed", "thu", "fri"];
  content: {
    [key: string]: string[];
  };
};

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
        content: "",
      } as SemesterGoalWidget;
    case WidgetType.SemesterPlan: // semester plan
      return {
        id: id,
        type: type,
        headings: ["週目", "目標", "教材"],
        content: {},
      } as SemesterPlanWidget;
    case WidgetType.Note: // note
      return {
        id: id,
        type: type,
        content: "",
      } as NoteWidget;
    case WidgetType.Schedule: // schedule
      return {
        id: id,
        type: type,
        headings: ["mon", "tue", "wed", "thu", "fri"],
        content: {},
      } as ScheduleWidget;
    default:
      return {
        id,
        type,
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
