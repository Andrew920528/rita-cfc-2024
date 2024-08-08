import {Alarm} from "@carbon/icons-react";
import {WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type ScheduleWidgetContent = {}; // currently content comes from user

export class ScheduleWidgetMaker extends WidgetMaker<ScheduleWidgetContent> {
  init() {
    return {};
  }
  isType(obj: any): obj is ScheduleWidgetContent {
    return true;
  }
  uiBook() {
    return {
      title: "課表",
      hint: "瀏覽每週課表",
      icon: <Alarm />,
      type: WidgetType.Schedule,
      minWidth: 400,
      maxWidth: 2000,
      minHeight: 300,
      maxHeight: 500,
    };
  }
}
