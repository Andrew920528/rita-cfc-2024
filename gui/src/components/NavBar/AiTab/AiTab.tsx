import React, {useEffect, useState} from "react";

import classNames from "classnames/bind";
import styles from "./AiTab.module.scss";
import {useTypedSelector} from "../../../store/store";
import {EMPTY_ID} from "../../../global/constants";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";

const cx = classNames.bind(styles);

const dummyPreviewWidgetContent: SemesterGoalWidgetContent = {
  goals: ["1", "2", "3"],
};

type Props = {};

function AiTabPlaceHolder() {
  return <div className={cx("placeholder")}>Placeholder</div>;
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
