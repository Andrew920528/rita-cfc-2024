import {Alarm} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type ScheduleWidgetContent = {}; // currently content comes from user

export class ScheduleWidgetMaker extends WidgetMaker<ScheduleWidgetContent> {
  init() {
    return {};
  }
  isType(obj: any): obj is ScheduleWidgetContent {
    return (
      typeof obj === "object" && obj !== null && Object.keys(obj).length === 0
    );
  }
  uiBook() {
    return {
      title: "Schedule",
      hint: "View weekly schedule",
      icon: <Alarm />,
      type: WidgetType.Schedule,
      minWidth: 400,
      maxWidth: 2000,
      minHeight: 300,
      maxHeight: 500,
      category: WidgetCategory.contextSetter,
    };
  }
  promptRecs(): PromptItem[] {
    return [];
  }
}
