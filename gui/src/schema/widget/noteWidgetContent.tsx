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
      title: "Notes",
      hint: "Quickly organize thoughts",
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
        chipMessage: "Find related videos for unit two",
        actualPrompt: "Find teaching videos for each chapter of unit two",
        icon: <VideoPlayer />,
        iconColor: "#B60071",
      },
      {
        chipMessage: "Provide ideas for class activities related to decimals",
        actualPrompt:
          "Recommend creative lesson activities to introduce decimals",
        icon: <Idea />,
        iconColor: "#FFB200",
      },
      {
        chipMessage: "Organize notes",
        actualPrompt: "Organize notes",
        icon: <Clean />,
        iconColor: "#478CCF",
      },
    ];
  }
}
