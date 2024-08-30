import {Catalog, Clean, Idea, VideoPlayer} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
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
      minWidth: 300,
      maxWidth: 600,
      minHeight: 200,
      maxHeight: 500,
      category: WidgetCategory.other,
    };
  }
  promptRecs(): PromptItem[] {
    return [
      {
        chipMessage: "尋找第二單元的相關影片",
        actualPrompt: "尋找第二單元每個章節的教學影片",
        icon: <VideoPlayer />,
        iconColor: "#B60071",
      },
      {
        chipMessage: "給我關於小數的課程活動點子",
        actualPrompt:
          "推薦我引導學生認識小數的課程活動，活動要有創意並能激起學生興趣",
        icon: <Idea />,
        iconColor: "#FFB200",
      },
      {
        chipMessage: "整理這份筆記的內容",
        actualPrompt: "整理這份筆記的內容",
        icon: <Clean />,
        iconColor: "#478CCF",
      },
    ];
  }
}
