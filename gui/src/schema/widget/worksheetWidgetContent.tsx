import {
  Alarm,
  Concept,
  Document,
  DocumentRequirements,
} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";
export enum QuestionType {
  MC = "Multiple Choices",
  FIB = "Fill in the Blanks",
  MATCH = "Matching",
}

type BaseQuestion = {
  questionId: string;
  question: string;
  type: QuestionType;
};
export type McQuestion = BaseQuestion & {
  choices: string[];
  answer: number;
};
export type FibQuestion = BaseQuestion & {
  answer: string[];
};
export type MatchQuestion = BaseQuestion & {
  leftList: string[];
  rightList: string[];
};

export type Question = McQuestion | FibQuestion | MatchQuestion;

export const initMcQuestion: Omit<McQuestion, "questionId"> = {
  question: "新增選擇題",
  type: QuestionType.MC,
  choices: ["選項 1", "選項 2", "選項 3"],
  answer: 0, // Index of the correct choice
};

export const initFibQuestion: Omit<FibQuestion, "questionId"> = {
  question: "新增填空題",
  type: QuestionType.FIB,
  answer: ["答案 1"], // Correct answer(s)
};

export const initMatchQuestion: Omit<MatchQuestion, "questionId"> = {
  question: "新增連連看",
  type: QuestionType.MATCH,
  leftList: ["選項 1", "選項 2", "選項 3"],
  rightList: ["選項 A", "選項 B", "選項 C"],
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
    return (
      typeof obj === "object" &&
      obj !== null &&
      Array.isArray(obj.questions) &&
      obj.questions.every((question: any) => {
        if (
          typeof question.questionId !== "string" ||
          typeof question.question !== "string" ||
          typeof question.type !== "number"
        ) {
          return false;
        }

        switch (question.type) {
          case QuestionType.MC:
            return (
              Array.isArray(question.choices) &&
              question.choices.every(
                (choice: any) => typeof choice === "string"
              ) &&
              typeof question.answer === "number"
            );

          case QuestionType.FIB:
            return (
              Array.isArray(question.answer) &&
              question.answer.every((ans: any) => typeof ans === "string")
            );

          case QuestionType.MATCH:
            return (
              Array.isArray(question.premises) &&
              question.premises.every(
                (premise: any) => typeof premise === "string"
              ) &&
              Array.isArray(question.options) &&
              question.options.every(
                (option: any) => typeof option === "string"
              ) &&
              Array.isArray(question.answer) &&
              question.answer.every((ans: any) => typeof ans === "number")
            );

          default:
            return false;
        }
      })
    );
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
      maxHeight: 800,
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
