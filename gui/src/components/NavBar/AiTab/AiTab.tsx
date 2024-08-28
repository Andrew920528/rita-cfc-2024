import React, {useEffect, useState} from "react";

import {useTypedSelector} from "../../../store/store";
import {EMPTY_ID} from "../../../global/constants";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";
import {IbmWatsonxAssistant} from "@carbon/icons-react";
import classNames from "classnames/bind";
import styles from "./AiTab.module.scss";
import EmbeddedChatroom from "./EmbeddedChatroom/EmbeddedChatroom";
import PreviewSpace from "./PreviewSpace/PreviewSpace";
import {CircularProgress} from "@mui/material";
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

function AiTabPlaceHolderWidgetCreating() {
  return (
    <div className={cx("placeholder")}>
      <IbmWatsonxAssistant size={80} />
      <div className={cx("placeholder-text")}>
        <CircularProgress color="inherit" size={12} />
        正在建立工具，請稍等。
      </div>
    </div>
  );
}

function AiTab({}: Props) {
  let widgets = useTypedSelector((state) => state.Widgets);
  console.log(widgets.previewDict[widgets.current]);
  return (
    <div className={cx("ai-tab")}>
      {widgets.current === EMPTY_ID ? (
        <AiTabPlaceHolder />
      ) : widgets.creating[widgets.current] ? (
        <AiTabPlaceHolderWidgetCreating />
      ) : (
        <>
          <div className={cx("chatroom-wrapper")}>
            <EmbeddedChatroom />
          </div>

          <div
            className={cx("preview-wrapper", {
              hidden: !widgets.previewDict[widgets.current],
            })}
          >
            <PreviewSpace />
          </div>
        </>
      )}
    </div>
  );
}

export default AiTab;
