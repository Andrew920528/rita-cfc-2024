import React, {useEffect, useState} from "react";

import classNames from "classnames/bind";
import styles from "./AiTab.module.scss";
import {useTypedSelector} from "../../../store/store";
import {EMPTY_ID} from "../../../global/constants";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";
import {IbmWatsonxAssistant} from "@carbon/icons-react";

const cx = classNames.bind(styles);

const dummyPreviewWidgetContent: SemesterGoalWidgetContent = {
  goals: ["1", "2", "3"],
};

type Props = {};

function AiTabPlaceHolder() {
  return (
    <div className={cx("placeholder")}>
      <IbmWatsonxAssistant size={80} />
      請建立或點選右方空間中的備課工具，讓Rita可以針對那個工具為您備課。
    </div>
  );
}

function AiTab({}: Props) {
  let widgets = useTypedSelector((state) => state.Widgets);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={cx("ai-tab")}>
      <div className={cx("chatroom-wrapper")}>
        {widgets.current === EMPTY_ID ? (
          <AiTabPlaceHolder />
        ) : (
          <div>Chatroom</div>
        )}
      </div>
      <button
        onClick={() => {
          setShowPreview(!showPreview);
        }}
      >
        toggle
      </button>
      <div
        className={cx("preview-wrapper", {
          hidden: !showPreview,
        })}
      >
        Preview Content
      </div>
    </div>
  );
}

export default AiTab;
