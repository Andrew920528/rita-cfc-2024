import {
  Alarm,
  Concept,
  Document,
  DocumentRequirements,
} from "@carbon/icons-react";
import {PromptItem, WidgetCategory, WidgetType} from "./widget";
import {WidgetMaker} from "./widget";
export enum QuestionType {
  MC, // Multiple Choices
  FIB, // Fill in the Blanks
  MATCH, // Matching
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
  question: "Add Multiple Choice",
  type: QuestionType.MC,
  choices: ["Options 1", "Options 2", "Options 3"],
  answer: 0, // Index of the correct choice
};

export const initFibQuestion: Omit<FibQuestion, "questionId"> = {
  question: "Add Fill In The Blank",
  type: QuestionType.FIB,
  answer: ["Answers 1"], // Correct answer(s)
};

export const initMatchQuestion: Omit<MatchQuestion, "questionId"> = {
  question: "Add Matching Questions",
  type: QuestionType.MATCH,
  leftList: ["Options 1", "Options 2", "Options 3"],
  rightList: ["Options A", "Options B", "Options C"],
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
              Array.isArray(question.leftList) &&
              question.leftList.every(
                (premise: any) => typeof premise === "string"
              ) &&
              Array.isArray(question.rightList) &&
              question.rightList.every(
                (option: any) => typeof option === "string"
              )
            );

          default:
            return true;
        }
      })
    );
  }
  uiBook() {
    return {
      title: "Worksheet",
      hint: "Create worksheet",
      icon: <Document />,
      type: WidgetType.Worksheet,
      minWidth: 600,
      maxWidth: 600,
      minHeight: 300,
      maxHeight: 800,
      category: WidgetCategory.aiTool,
    };
  }
  promptRecs(): PromptItem[] {
    return [
      {
        chipMessage: "Design a worksheet for decimal operations practice",
        actualPrompt: "Design a worksheet for decimal operations practice",
        icon: <Concept />,
        iconColor: "#FFB200",
      },
      {
        chipMessage: "Create five quiz questions that tests arithmatic operations",
        actualPrompt: "Create five quiz questions that tests arithmatic operations",
        icon: <DocumentRequirements />,
        iconColor: "#B60071",
      },
    ];
  }
}
