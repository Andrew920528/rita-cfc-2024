import React, {useCallback, useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./WorksheetWidget.module.scss";
import {Skeleton} from "@mui/material";
import {useWidgetLoading} from "../../../features/UiSlice";
import FileDownload from "./FileDownload";
import PdfPreview from "./PdfPreview";
import {useTypedSelector} from "../../../store/store";

const cx = classNames.bind(styles);
type Props = {
  wid: string;
};

const WorksheetWidget = (props: Props) => {
  const widgetLoading = useWidgetLoading(props.wid);
  const [previewReady, setPreviewReady] = useState<boolean>(false);
  const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
  const currWidget = useTypedSelector((state) => state.Widgets.current);
  return widgetLoading ? (
    <WorksheetSkeleton />
  ) : (
    <div className={cx("worksheet-widget")}>
      <button
        onClick={() => {
          setPreviewReady(!previewReady);
        }}
      >
        Toggle to debug
      </button>
      {previewReady ? (
        <WorkSheetPreview />
      ) : (
        <WorksheetPlaceholder ideating={props.wid === currWidget} />
      )}
    </div>
  );
};

const WorkSheetPreview = () => {
  return (
    <div className={cx("worksheet-preview")}>
      <PdfPreview />
      <FileDownload />
    </div>
  );
};

const WorksheetPlaceholder = (props: {ideating: boolean}) => {
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

      {props.ideating ? (
        <div className={cx("status", "--label")}>
          討論中 <IdeatingDots />
        </div>
      ) : (
        <div className={cx("status", "--label")}>討論已暫停</div>
      )}
    </div>
  );
};

const IdeatingDots = () => {
  return (
    <div className={cx("ideating-dots")}>
      <div className={cx("ideating-dot")} />
      <div className={cx("ideating-dot")} />
      <div className={cx("ideating-dot")} />
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
