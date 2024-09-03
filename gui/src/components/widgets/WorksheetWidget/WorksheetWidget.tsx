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
} from "../../../schema/widget/worksheetWidgetContent";
import {useDispatch} from "react-redux";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import Accordion from "../../ui_components/Accordion/Accordion";
import IconButton from "../../ui_components/IconButton/IconButton";
import {MagicWand} from "@carbon/icons-react";

const cx = classNames.bind(styles);

const WorksheetWidget = ({
  widget,
  loading,
  preview = false,
}: WidgetContentProps) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  // useEffect(() => {
  //   console.trace(widget);
  // }, [widget]);
  // console.trace(widget);
  const dispatch = useAppDispatch();
  const addQuestionForDebug = () => {
    let newQ = {
      question: "What is your name",
      questionType: QuestionType.FR,
      questionContent: {},
    } as Omit<Question, "questionId">;

    dispatch(
      WidgetsServices.actions.addQuestion({
        widgetId: widget.id,
        question: newQ,
      })
    );
  };

  return loading ? (
    <WorksheetSkeleton />
  ) : (
    <div className={cx("worksheet-widget")}>
      <button
        onClick={() => {
          addQuestionForDebug();
        }}
      >
        Add Question
      </button>

      {showPreview ? (
        <WorkSheetPreview />
      ) : (widget.content as WorksheetWidgetContent).questions.length === 0 ? (
        <WorksheetPlaceholder />
      ) : (
        <>
          <WorkSheetQuestionStack widget={widget} />
          <IconButton
            text="生成學習單"
            onClick={() => {
              setShowPreview(!showPreview);
            }}
            icon={<MagicWand />}
            mode="primary"
          />
        </>
      )}
    </div>
  );
};

const WorkSheetQuestionStack = ({widget}: {widget: Widget}) => {
  return (
    <div className={cx("worksheet-question-stack")}>
      {(widget.content as WorksheetWidgetContent).questions.map(
        (questionObj, index) => {
          return (
            <Accordion
              key={questionObj.questionId}
              id={questionObj.questionId}
              header={<>{`Question ${index + 1}`}</>}
              content={
                <div
                  className={cx("worksheet-question-stack-item")}
                  key={index}
                >
                  {questionObj.question}
                </div>
              }
            />
          );
        }
      )}
    </div>
  );
};

const WorkSheetPreview = () => {
  return (
    <div className={cx("worksheet-preview")}>
      {/* <PdfPreview />
      <FileDownload /> */}
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
