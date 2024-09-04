import React, {useEffect} from "react";
import {
  FibQuestion,
  MatchQuestion,
  McQuestion,
  Question,
  QuestionType,
} from "../../../schema/widget/worksheetWidgetContent";

import classNames from "classnames/bind";
import styles from "./WorksheetWidget.module.scss";
import IconButton from "../../ui_components/IconButton/IconButton";
import {CheckmarkOutline, Edit} from "@carbon/icons-react";
import Textbox from "../../ui_components/Textbox/Textbox";
const cx = classNames.bind(styles);
type QuestionViewProps = {
  question: Question;
  editing: boolean;
  widgetId: string;
};

export const QuestionView = ({
  question,
  editing,
  widgetId,
}: QuestionViewProps) => {
  const questionType = question.type;
  switch (questionType) {
    case QuestionType.MC:
      return (
        <McQuestionView
          question={question}
          editing={editing}
          widgetId={widgetId}
        />
      );
    case QuestionType.FIB:
      return (
        <FibQuestionView
          question={question}
          editing={editing}
          widgetId={widgetId}
        />
      );
    case QuestionType.MATCH:
      return (
        <MatchQuestionView
          question={question}
          editing={editing}
          widgetId={widgetId}
        />
      );
  }
};

export default QuestionView;

function McQuestionView({question, editing, widgetId}: QuestionViewProps) {
  const questionContent = question as McQuestion;
  const Choice = ({
    content,
    selected,
  }: {
    content: string;
    selected: boolean;
  }) => {
    return (
      <div className={cx("choice")}>
        <div className={cx("circle", {selected})}>
          {selected && <div className={cx("check")} />}
        </div>
        <div className={cx("choice-text")}>{content}</div>
      </div>
    );
  };

  return (
    <div className={cx("question-view", "mc")}>
      <p className={cx("question-header")}>{question.question}</p>
      <div className={cx("choices")}>
        {questionContent.choices.map((choice, ind) => (
          <Choice
            key={choice}
            content={choice}
            selected={ind === questionContent.answer}
          />
        ))}
      </div>
    </div>
  );
}

function FibQuestionView({question, editing, widgetId}: QuestionViewProps) {
  const questionContent = question as FibQuestion;
  const [displayQuestionObj, setDisplayQuestionObj] =
    React.useState<Question>(question);
  const [questionIsChanged, setQuestionIsChanged] =
    React.useState<boolean>(false);
  const displayQuestionContent = displayQuestionObj as FibQuestion;

  useEffect(() => {
    if (!questionIsChanged) return;
    console.log("Save new widget content");
    setQuestionIsChanged(false);
  }, [editing]);
  return (
    <div className={cx("question-view", "fib")}>
      {editing ? (
        <Textbox
          value={displayQuestionObj.question}
          onChange={(e) => {
            setDisplayQuestionObj({
              ...displayQuestionObj,
              question: e.currentTarget.value,
            });
            setQuestionIsChanged(true);
          }}
          flex
          mode="form"
          label="題目"
        />
      ) : (
        <p className={cx("question-header")}>{displayQuestionObj.question}</p>
      )}
      <div className={cx("answer")}>
        參考答案：{displayQuestionContent.answer.join(", ")}
      </div>
    </div>
  );
}

function MatchQuestionView({question, editing, widgetId}: QuestionViewProps) {
  const questionContent = question as MatchQuestion;
  const leftList = questionContent.premises;
  const rightList = questionContent.answer.map(
    (index) => questionContent.options[index]
  );

  return (
    <div className={cx("question-view", "fib")}>
      <p className={cx("question-header")}>{question.question}</p>
      <div className={cx("matches")}>
        {leftList.map((left, ind) => (
          <div className={cx("match")} key={left}>
            <div className={cx("left")}>{left}</div>
            <div className={cx("dots")}></div>
            <div className={cx("right")}>
              {rightList[ind] ? rightList[ind] : "ERROR"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
