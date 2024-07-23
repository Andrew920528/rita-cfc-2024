import React, {useCallback, useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./WorksheetWidget.module.scss";
import {Skeleton} from "@mui/material";
import {useWidgetLoading} from "../../../features/UiSlice";

const cx = classNames.bind(styles);
type Props = {
  wid: string;
};

const WorksheetWidget = (props: Props) => {
  const loading = useWidgetLoading(props.wid);
  const [doc, setDoc] = useState<boolean>(false);
  const [ideating, setIdeating] = useState<boolean>(true);
  return loading ? (
    <WorksheetSkeleton />
  ) : (
    <div className={cx("worksheet-widget")}>
      {doc ? (
        <WorkSheetPreview />
      ) : (
        <WorksheetPlaceholder ideating={ideating} />
      )}
    </div>
  );
};

const WorkSheetPreview = () => {
  return <div className={cx("worksheet-preview")}></div>;
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
        <div className={cx("status", "--label")}>討論未開始</div>
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
