import {
  Alarm,
  Concept,
  Document,
  DocumentRequirements,
} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";

export enum QuestionType {
  MC,
  FR,
}

type McContent = {
  choices: string[];
  answer: number;
};
type FrContent = {};

export type Question = {
  questionId: string;
  question: string;
  questionType: QuestionType;
  questionContent: McContent | FrContent;
};

export type WorksheetWidgetContent = {
  questions: Question[];
};

export class WorksheetWidgetMaker extends WidgetMaker<WorksheetWidgetContent> {
  init() {
    return {
      questions: [],
    };
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
      category: WidgetCategory.aiTool,
    };
  }
  promptRecs(): PromptItem[] {
    return [
      {
        chipMessage: "設計一份讓孩子練習小數運算的學習單",
        actualPrompt: "設計一份讓孩子練習小數運算的學習單",
        icon: <Concept />,
        iconColor: "#FFB200",
      },
      {
        chipMessage: "出五道測驗四則運算的選擇題",
        actualPrompt: "出五道測驗四則運算的選擇題",
        icon: <DocumentRequirements />,
        iconColor: "#B60071",
      },
    ];
  }
}
