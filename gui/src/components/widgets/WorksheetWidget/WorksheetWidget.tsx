import React, {useCallback, useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./WorksheetWidget.module.scss";
import {Skeleton} from "@mui/material";
import FileDownload from "./FileDownload";
import PdfPreview from "./PdfPreview";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {Widget, WidgetType} from "../../../schema/widget/widget";
import {WidgetContentProps} from "../WidgetFrame/WidgetFrame";
import {
  Question,
  QuestionType,
  WorksheetWidgetContent,
  initFibQuestion,
  initMatchQuestion,
  initMcQuestion,
} from "../../../schema/widget/worksheetWidgetContent";
import {useDispatch} from "react-redux";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import Accordion from "../../ui_components/Accordion/Accordion";
import IconButton from "../../ui_components/IconButton/IconButton";
import {
  Add,
  CheckmarkOutline,
  Edit,
  List,
  MagicWand,
  Pen,
  TrashCan,
  WatsonHealth3DCurveAutoColon,
} from "@carbon/icons-react";
import QuestionView from "./QuestionView";
import {TText} from "../../TText/TText";

const cx = classNames.bind(styles);

const WorksheetWidget = ({
  widget,
  loading,
  preview = false,
}: WidgetContentProps) => {
  const [showWorksheetPreview, setShowWorksheetPreview] =
    useState<boolean>(false);
  const [showPickQuestion, setShowPickQuestion] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const addQuestion = (questionType: QuestionType) => {
    if (questionType === QuestionType.MC) {
      dispatch(
        WidgetsServices.actions.addQuestion({
          widgetId: widget.id,
          question: initMcQuestion,
        })
      );
    } else if (questionType === QuestionType.FIB) {
      dispatch(
        WidgetsServices.actions.addQuestion({
          widgetId: widget.id,
          question: initFibQuestion,
        })
      );
    } else if (questionType === QuestionType.MATCH) {
      dispatch(
        WidgetsServices.actions.addQuestion({
          widgetId: widget.id,
          question: initMatchQuestion,
        })
      );
    }
  };

  const PickQuestion = () => {
    return (
      <div className={cx("pick-ques-container")}>
        <div className={cx("pick-ques-header")}>
          <p className={cx("--label")}>
            <TText>Select Question Type | </TText>
          </p>
          <p
            className={cx("--label", "cancel")}
            onClick={() => setShowPickQuestion(false)}
          >
            <TText>Cancel</TText>
          </p>
        </div>
        <div className={cx("pick-ques")}>
          <IconButton
            text="Multiple Choice"
            icon={<List />}
            mode="ghost"
            flex
            onClick={() => {
              addQuestion(QuestionType.MC);
              setShowPickQuestion(false);
            }}
          />
          <IconButton
            text="Fill In The Blank"
            icon={<Pen />}
            mode="ghost"
            flex
            onClick={() => {
              addQuestion(QuestionType.FIB);
              setShowPickQuestion(false);
            }}
          />
          <IconButton
            text="Matching Question"
            icon={<WatsonHealth3DCurveAutoColon />}
            mode="ghost"
            flex
            onClick={() => {
              addQuestion(QuestionType.MATCH);
              setShowPickQuestion(false);
            }}
          />
        </div>
      </div>
    );
  };

  const WorksheetPreview = ({content}: {content: Question[]}) => {
    return (
      <div className={cx("worksheet-preview")}>
        <PdfPreview content={content} />
        <div className={cx("worksheet-buttons")}>
          <FileDownload content={content} />
          <IconButton
            onClick={() => {
              setShowWorksheetPreview(!showWorksheetPreview);
            }}
            icon={<CheckmarkOutline />}
            mode="ghost"
            text="Close Preview"
          />
        </div>
      </div>
    );
  };

  return loading ? (
    <WorksheetSkeleton />
  ) : (
    <div className={cx("worksheet-widget")}>
      {showWorksheetPreview ? (
        <WorksheetPreview
          content={(widget.content as WorksheetWidgetContent).questions}
        />
      ) : (widget.content as WorksheetWidgetContent).questions.length === 0 ? (
        <WorksheetPlaceholder />
      ) : (
        <>
          <WorkSheetQuestionStack widget={widget} preview={preview} />
        </>
      )}
      {showPickQuestion && <PickQuestion />}

      {preview ? (
        <div className={cx("--label")}>
          <TText>
            To add or edit questions, please first select apply and modify directly in the left.
          </TText>
        </div>
      ) : (
        <div className={cx("btns", "add-question-btns")}>
          {!showWorksheetPreview && (
            <div className={cx("btn-row")}>
              <IconButton
                onClick={() => {
                  setShowPickQuestion(!showPickQuestion);
                }}
                icon={<Add />}
                mode="ghost"
                text="Add Question"
              />

              <IconButton
                text="Generate Worksheet"
                onClick={() => {
                  setShowWorksheetPreview(!showWorksheetPreview);
                }}
                icon={<MagicWand />}
                mode="primary"
                disabled={
                  (widget.content as WorksheetWidgetContent).questions
                    .length === 0
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const WorkSheetQuestionStack = ({
  widget,
  preview,
}: {
  widget: Widget;
  preview: boolean;
}) => {
  const [editingList, setEditingList] = React.useState<boolean[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let newList = [];
    for (
      let i = 0;
      i < (widget.content as WorksheetWidgetContent).questions.length;
      i++
    ) {
      newList.push(false);
    }
  }, [(widget.content as WorksheetWidgetContent).questions.length]);
  return (
    <div className={cx("worksheet-question-stack")}>
      {(widget.content as WorksheetWidgetContent).questions.map(
        (questionObj, index) => {
          let editing = editingList[index];
          let setEditing = (value: boolean) => {
            let newList = [...editingList];
            newList[index] = value;
            setEditingList(newList);
          };
          return (
            <Accordion
              key={questionObj.questionId}
              id={questionObj.questionId}
              mode="outlined"
              header={
                <div className={cx("header")}>
                  <TText>Question</TText> {` ${index + 1}`}
                </div>
              }
              content={
                <div
                  className={cx("worksheet-question-stack-item")}
                  key={index}
                >
                  <QuestionView
                    question={questionObj}
                    editing={editing}
                    widgetId={widget.id}
                  />
                  {!preview && (
                    <div className={cx("view-btn")}>
                      {editing ? (
                        <IconButton
                          mode="primary"
                          icon={<CheckmarkOutline />}
                          text="Confirm"
                          onClick={() => setEditing(false)}
                        />
                      ) : (
                        <IconButton
                          mode="ghost"
                          icon={<Edit />}
                          text="Edit"
                          onClick={() => setEditing(true)}
                        />
                      )}
                      <IconButton
                        mode="danger-ghost"
                        icon={<TrashCan />}
                        text="Delete"
                        onClick={() => {
                          dispatch(
                            WidgetsServices.actions.deleteQuestion({
                              widgetId: widget.id,
                              questionId: questionObj.questionId,
                            })
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              }
            />
          );
        }
      )}
    </div>
  );
};

const WorksheetPlaceholder = () => {
  return (
    <div className={cx("worksheet-placeholder")}>
      <div className={cx("title")}>
        <div className={cx("decor")} />
        <TText>
          Chat with Rita to start designing worksheets, Rita will discuss with you and generate worksheets.
        </TText>
      </div>

      <div className={cx("example-title")}>
        <strong>
          <TText>Example</TText> :
        </strong>
      </div>
      <div className={cx("example")}>
        ”
        <TText>
          For today's class video, I want students to express opinions through worksheets.
        </TText>
        ”
      </div>
      <div className={cx("example")}>
        ”<TText>I want a math practice worksheet.</TText>“
      </div>
      <div className={cx("example")}>
        ”<TText>Let's design a worksheet for field trips!</TText>“
      </div>
    </div>
  );
};

const WorksheetSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      animation="wave"
      sx={{flexGrow: 1}}
    />
  );
};

export default WorksheetWidget;
