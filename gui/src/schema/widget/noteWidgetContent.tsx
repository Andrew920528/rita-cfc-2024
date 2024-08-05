import {Catalog} from "@carbon/icons-react";
import {WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export type NoteWidgetContent = {
  note: string;
};

export class NoteWidgetMaker extends WidgetMaker<NoteWidgetContent> {
  init() {
    return {
      note: "",
    };
  }
  isType(obj: any): obj is NoteWidgetContent {
    return (
      typeof obj === "object" && obj !== null && typeof obj.note === "string"
    );
  }
  uiBook() {
    return {
      title: "筆記",
      hint: "快速整理想法",
      icon: <Catalog />,
      type: WidgetType.Note,
      width: 300,
      minHeight: 200,
      maxHeight: 500,
    };
  }
}
