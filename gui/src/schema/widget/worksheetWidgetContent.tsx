import {Alarm, Document} from "@carbon/icons-react";
import {WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type WorksheetWidgetContent = {}; // currently content comes from user

export class WorksheetWidgetMaker extends WidgetMaker<WorksheetWidgetContent> {
  init() {
    return {};
  }
  isType(obj: any): obj is WorksheetWidgetContent {
    return true;
  }
  uiBook() {
    return {
      title: "學習單",
      hint: "製作學習單",
      icon: <Document />,
      type: WidgetType.Worksheet,
      minWidth: 400,
      maxWidth: 400,
      minHeight: 300,
      maxHeight: 500,
    };
  }
}
