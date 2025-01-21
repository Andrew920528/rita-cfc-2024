import React, {useEffect, useRef, useState} from "react";

import {useTypedSelector} from "../../../store/store";
import {EMPTY_ID} from "../../../global/constants";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";
import {
  ChevronDown,
  ChevronRight,
  IbmWatsonxAssistant,
} from "@carbon/icons-react";
import classNames from "classnames/bind";
import styles from "./AiTab.module.scss";
import EmbeddedChatroom from "./EmbeddedChatroom/EmbeddedChatroom";
import PreviewSpace from "./PreviewSpace/PreviewSpace";
import {CircularProgress} from "@mui/material";
import useVerticalHandle from "../VerticalHandle/VerticalHandle";
import {TText} from "../../TText/TText";
const cx = classNames.bind(styles);

type Props = {};

function AiTabPlaceHolder() {
  return (
    <div className={cx("placeholder")}>
      <IbmWatsonxAssistant size={80} />
      <TText>
        Please create or select a preparation tool from the rightRitaTo help you prepare lessons with that tool.
      </TText>
    </div>
  );
}

function AiTabPlaceHolderWidgetCreating() {
  return (
    <div className={cx("placeholder")}>
      <IbmWatsonxAssistant size={80} />
      <div className={cx("placeholder-text")}>
        <CircularProgress color="inherit" size={12} />
        <TText>Creating tool, please wait.</TText>
      </div>
    </div>
  );
}

function AiTab({}: Props) {
  const {VerticalHandle, mainHeight, setMainHeight} = useVerticalHandle({
    unit: "percent",
    expandDirection: "up",
    minHeight: 40,
    initHeight: 40,
  });
  let widgets = useTypedSelector((state) => state.Widgets);
  const [collapsePreview, setCollapsePreview] = useState(true);
  useEffect(() => {
    if (collapsePreview && widgets.previewDict[widgets.current]) {
      setCollapsePreview(false);
    }
  }, [widgets.previewDict[widgets.current]]);

  function onclickCollapse() {
    let collapse = !collapsePreview;
    setCollapsePreview(collapse);
  }

  return (
    <div className={cx("ai-tab")}>
      {widgets.current === EMPTY_ID ? (
        <AiTabPlaceHolder />
      ) : widgets.creating[widgets.current] ? (
        <AiTabPlaceHolderWidgetCreating />
      ) : (
        <>
          <div
            className={cx("chatroom-wrapper")}
            style={{height: `${100 - mainHeight}%`}}
          >
            <EmbeddedChatroom />
          </div>
          <VerticalHandle disabled={collapsePreview} />
          <div
            className={cx("preview-wrapper", {
              collapse: collapsePreview,
            })}
            style={{height: `${mainHeight}%`}}
          >
            <div onClick={onclickCollapse} className={cx("preview-header")}>
              {collapsePreview ? <ChevronRight /> : <ChevronDown />}
              <TText>Content Preview</TText>
            </div>
            <PreviewSpace />
          </div>
        </>
      )}
    </div>
  );
}

export default AiTab;
