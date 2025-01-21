import React, {useCallback, useEffect, useState} from "react";
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
import {Add, CheckmarkOutline, Edit, TrashCan} from "@carbon/icons-react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {generateId} from "../../../utils/util";
import {useAppDispatch} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {TText} from "../../TText/TText";
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
  // stores the McQuestion object
  const [displayQuestionObj, setDisplayQuestionObj] =
    React.useState<McQuestion>(question as McQuestion);
  const questionIsChanged = React.useRef<boolean>(false);

  // The ids at each index corresponds to each choices
  const [choiceIds, setChoiceIds] = useState<string[]>([]);

  // for changing each choice content without re-rendering the entire list
  const choicesRef = React.useRef<string[]>([]);
  const dispatch = useAppDispatch();
  // Initialize choiceIds and choiceRefs
  useEffect(() => {
    let newlist = [];
    for (let i in displayQuestionObj.choices) {
      newlist.push(generateId());
      choicesRef.current[i] = displayQuestionObj.choices[i];
    }
    setChoiceIds(newlist);
  }, []);

  // saves global state
  useEffect(() => {
    if (!questionIsChanged.current) return;
    setDisplayQuestionObj({
      ...displayQuestionObj,
      choices: choicesRef.current,
    });

    dispatch(
      WidgetsServices.actions.updateQuestion({
        widgetId,
        question: displayQuestionObj,
        questionId: question.questionId,
      })
    );

    questionIsChanged.current = false;
  }, [editing]);

  const handleSelect = useCallback(
    (index: number) => {
      questionIsChanged.current = true;

      setDisplayQuestionObj({
        ...displayQuestionObj,
        answer: index,
        choices: choicesRef.current,
      });
    },
    [displayQuestionObj]
  );
  const handleContentChange = useCallback((index: number, value: string) => {
    questionIsChanged.current = true;
    choicesRef.current[index] = value;
  }, []);
  const handleDeleteChoice = useCallback(
    (index: number) => {
      questionIsChanged.current = true;
      let newChoiceList = [
        ...displayQuestionObj.choices.slice(0, index),
        ...displayQuestionObj.choices.slice(index + 1),
      ];

      setDisplayQuestionObj({
        ...displayQuestionObj,
        choices: newChoiceList,
        answer:
          displayQuestionObj.answer > index
            ? displayQuestionObj.answer - 1
            : displayQuestionObj.answer,
      });

      // Remove corresponding id
      let newChoiceIds = [
        ...choiceIds.slice(0, index),
        ...choiceIds.slice(index + 1),
      ];
      setChoiceIds(newChoiceIds);
      choicesRef.current = newChoiceList;
    },
    [displayQuestionObj, choiceIds]
  );
  const handleAddChoice = useCallback(() => {
    questionIsChanged.current = true;
    let newChoices = [...displayQuestionObj.choices, ""];
    setDisplayQuestionObj({
      ...displayQuestionObj,
      choices: newChoices,
    });
    setChoiceIds([...choiceIds, generateId()]);
    choicesRef.current = newChoices;
  }, [displayQuestionObj, choiceIds]);

  return (
    <div className={cx("question-view", "mc")}>
      {editing ? (
        <Textbox
          value={displayQuestionObj.question}
          onChange={(e) => {
            setDisplayQuestionObj({
              ...displayQuestionObj,
              question: e.currentTarget.value,
            });
            questionIsChanged.current = true;
          }}
          flex
          mode="form"
          label="Question"
        />
      ) : (
        <p className={cx("question-header")}>{question.question}</p>
      )}

      <div className={cx("choices")}>
        {displayQuestionObj.choices.map((choice, ind) => {
          if (choiceIds[ind] === undefined) return null;
          return (
            <Choice
              key={choiceIds[ind]}
              content={choice}
              selected={ind === displayQuestionObj.answer}
              editing={editing}
              editSelect={() => handleSelect(ind)}
              editContent={(value) => handleContentChange(ind, value)}
              deleteChoice={() => handleDeleteChoice(ind)}
            />
          );
        })}
      </div>
      {editing && (
        <IconButton
          mode="ghost"
          icon={<Add />}
          text="Add Option"
          onClick={handleAddChoice}
        />
      )}
    </div>
  );
}

const Choice = ({
  content, // initial display value
  selected, // whether the choice is selected
  editing, // whether the choice is in editing mode
  editSelect, // edit the right answer
  editContent, // edit the value
  deleteChoice, // delete the choice
}: {
  content: string;
  selected: boolean;
  editing: boolean;
  editSelect: () => void;
  editContent: (value: string) => void;
  deleteChoice: () => void;
}) => {
  return (
    <div className={cx("choice")}>
      <div
        className={cx("circle", {selected, editing})}
        onClick={() => {
          if (!editing) return;
          editSelect();
        }}
      >
        {selected && <div className={cx("check")} />}
      </div>
      {editing ? (
        <Textbox
          defaultValue={content}
          onChange={(e) => {
            editContent(e.currentTarget.value);
          }}
          mode="form"
          name={content}
        />
      ) : (
        <div className={cx("choice-text")}>{content}</div>
      )}
      {editing && (
        <IconButton
          mode="ghost"
          icon={<TrashCan />}
          onClick={() => {
            deleteChoice();
          }}
        />
      )}
    </div>
  );
};

function FibQuestionView({question, editing, widgetId}: QuestionViewProps) {
  const [displayQuestionObj, setDisplayQuestionObj] =
    React.useState<Question>(question);
  const [questionIsChanged, setQuestionIsChanged] =
    React.useState<boolean>(false);
  const displayQuestionContent = displayQuestionObj as FibQuestion;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!questionIsChanged) return;
    dispatch(
      WidgetsServices.actions.updateQuestion({
        widgetId,
        question: displayQuestionObj,
        questionId: question.questionId,
      })
    );
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
          label="Question"
        />
      ) : (
        <p className={cx("question-header")}>{displayQuestionObj.question}</p>
      )}
      <div className={cx("answer")}>
        <TText>Answer Key:</TText>
        {editing ? (
          <Textbox
            value={displayQuestionContent.answer.join(", ")}
            onChange={(e) => {
              setDisplayQuestionObj({
                ...displayQuestionObj,
                answer: e.currentTarget.value.split(", "),
              });
              setQuestionIsChanged(true);
            }}
            flex
            mode="form"
          />
        ) : (
          displayQuestionContent.answer.join(", ")
        )}
      </div>
    </div>
  );
}

function MatchQuestionView({question, editing, widgetId}: QuestionViewProps) {
  const [displayQuestionObj, setDisplayQuestionObj] =
    React.useState<Question>(question);
  const questionContent = displayQuestionObj as MatchQuestion;
  const leftList = questionContent.leftList;
  const rightList = questionContent.rightList;
  // The ids at each index corresponds to each choices
  const [matchIds, setMatchIds] = useState<string[]>([]);

  // for changing each choice content without re-rendering the entire list
  const leftRef = React.useRef<string[]>([]);
  const rightRef = React.useRef<string[]>([]);

  const questionIsChanged = React.useRef<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let newlist = [];
    for (let i in questionContent.leftList) {
      newlist.push(generateId());
      rightRef.current[i] = questionContent.rightList[i];
      leftRef.current[i] = questionContent.leftList[i];
    }

    setMatchIds(newlist);
  }, []);

  // saves global state
  useEffect(() => {
    if (!questionIsChanged.current) return;
    setDisplayQuestionObj({
      ...displayQuestionObj,
      leftList: leftRef.current,
      rightList: rightRef.current,
    });
    dispatch(
      WidgetsServices.actions.updateQuestion({
        widgetId,
        question: displayQuestionObj,
        questionId: question.questionId,
      })
    );

    questionIsChanged.current = false;
  }, [editing]);

  function handleContentChange(
    listType: "left" | "right",
    index: number,
    value: string
  ) {
    if (listType === "left") {
      leftRef.current[index] = value;
    } else {
      rightRef.current[index] = value;
    }
    questionIsChanged.current = true;
  }

  function deleteMatch(index: number) {
    questionIsChanged.current = true;
    let newLeftList = [
      ...questionContent.leftList.slice(0, index),
      ...questionContent.leftList.slice(index + 1),
    ];

    let newRightList = [
      ...questionContent.rightList.slice(0, index),
      ...questionContent.rightList.slice(index + 1),
    ];

    setDisplayQuestionObj({
      ...displayQuestionObj,
      leftList: newLeftList,
      rightList: newRightList,
    });

    // Remove corresponding id
    let newMatchIds = [
      ...matchIds.slice(0, index),
      ...matchIds.slice(index + 1),
    ];
    setMatchIds(newMatchIds);
    leftRef.current = newLeftList;
    rightRef.current = newRightList;
  }

  const handleAddChoice = () => {
    questionIsChanged.current = true;
    let newLeft = [...questionContent.leftList, "Add Option"];
    let newRight = [...questionContent.rightList, "Add Option"];
    setDisplayQuestionObj({
      ...displayQuestionObj,
      leftList: newLeft,
      rightList: newRight,
    });
    setMatchIds([...matchIds, generateId()]);
    leftRef.current = newLeft;
    rightRef.current = newRight;
  };

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
            questionIsChanged.current = true;
          }}
          flex
          mode="form"
          label="Question"
        />
      ) : (
        <p className={cx("question-header")}>{question.question}</p>
      )}

      <div className={cx("matches")}>
        {leftList.map((left, ind) => {
          if (matchIds[ind] === undefined) return null;
          return (
            <div className={cx("match")} key={matchIds[ind]}>
              {editing ? (
                <Textbox
                  defaultValue={left}
                  onChange={(e) => {
                    handleContentChange("left", ind, e.currentTarget.value);
                  }}
                  mode="form"
                />
              ) : (
                <div className={cx("left")}>{left}</div>
              )}
              <div className={cx("dots")}></div>
              {editing ? (
                <Textbox
                  defaultValue={rightList[ind]}
                  onChange={(e) => {
                    handleContentChange("right", ind, e.currentTarget.value);
                  }}
                  mode="form"
                />
              ) : (
                <div className={cx("right")}>
                  {rightList[ind] !== undefined ? rightList[ind] : "ERROR"}
                </div>
              )}
              {editing && (
                <IconButton
                  mode="ghost"
                  icon={<TrashCan />}
                  onClick={() => {
                    deleteMatch(ind);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {editing && (
        <IconButton
          mode="ghost"
          icon={<Add />}
          text="Add Option"
          onClick={handleAddChoice}
        />
      )}
    </div>
  );
}
