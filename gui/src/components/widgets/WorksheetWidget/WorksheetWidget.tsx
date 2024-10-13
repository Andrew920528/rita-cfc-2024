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
          <p className={cx("--label")}>選擇題型 | </p>
          <p
            className={cx("--label", "cancel")}
            onClick={() => setShowPickQuestion(false)}
          >
            取消
          </p>
        </div>
        <div className={cx("pick-ques")}>
          <IconButton
            text="選擇題"
            icon={<List />}
            mode="ghost"
            flex
            onClick={() => {
              addQuestion(QuestionType.MC);
              setShowPickQuestion(false);
            }}
          />
          <IconButton
            text="填空題"
            icon={<Pen />}
            mode="ghost"
            flex
            onClick={() => {
              addQuestion(QuestionType.FIB);
              setShowPickQuestion(false);
            }}
          />
          <IconButton
            text="連連看"
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
            text="關閉預覽"
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
          若要新增或修改問題，請先選擇「套用」並在左側視窗直接進行更改
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
                text="新增問題"
              />

              <IconButton
                text="生成學習單"
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
              header={<div className={cx("header")}>{`題目 ${index + 1}`}</div>}
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
                          text="確認"
                          onClick={() => setEditing(false)}
                        />
                      ) : (
                        <IconButton
                          mode="ghost"
                          icon={<Edit />}
                          text="編輯"
                          onClick={() => setEditing(true)}
                        />
                      )}
                      <IconButton
                        mode="danger-ghost"
                        icon={<TrashCan />}
                        text="刪除"
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
        與Rita交談來開始設計學習單，Rita 會與您討論並生成學習單供您參考。
      </div>

      <div className={cx("example-title")}>
        <strong>範例:</strong>
      </div>
      <div className={cx("example")}>
        ”針對今天準備的影片內容，我想要讓學生可以藉由學習單發表意見。“
      </div>
      <div className={cx("example")}>”我要一份數學練習的學習單。“</div>
      <div className={cx("example")}>”來設計校外教學的學習單吧！“</div>
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
