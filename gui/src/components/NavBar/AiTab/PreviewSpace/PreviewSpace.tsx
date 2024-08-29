import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./PreviewSpace.module.scss";
import IconButton from "../../../ui_components/IconButton/IconButton";
import {MagicWand} from "@carbon/icons-react";
import {
  Widget,
  WidgetContent,
  WidgetType,
} from "../../../../schema/widget/widget";
import {useAppDispatch, useTypedSelector} from "../../../../store/store";
import {EMPTY_ID} from "../../../../global/constants";
import WidgetFrame, {
  WidgetFramePreview,
} from "../../../widgets/WidgetFrame/WidgetFrame";
import {WidgetsServices} from "../../../../features/WidgetsSlice";

const cx = classNames.bind(styles);
type Props = {};

const PreviewSpace = (props: Props) => {
  const widgets = useTypedSelector((state) => state.Widgets);
  const dispatch = useAppDispatch();
  function applyPreview(widget: Widget) {
    let newWidget = {
      id: widget.id,
      type: widget.type,
      content: widget.content,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
        mode: "actual",
      })
    );

    // clean up preview
    dispatch(WidgetsServices.actions.removePreviewWidget(widget.id));
  }
  return (
    <div className={cx("preview-space")}>
      {widgets.current in widgets.previewDict ? (
        <>
          <div className={cx("preview-content")}>
            <WidgetFramePreview
              previewWidget={widgets.previewDict[widgets.current]}
            />
          </div>
          <div>
            <IconButton
              icon={<MagicWand />}
              text="套用"
              mode="primary"
              onClick={() => {
                if (!(widgets.current in widgets.previewDict)) return;
                applyPreview(widgets.previewDict[widgets.current]);
              }}
              disabled={!(widgets.current in widgets.previewDict)}
            />
          </div>
        </>
      ) : (
        <PreviewPlaceHolder />
      )}
    </div>
  );
};

function PreviewPlaceHolder() {
  return (
    <div className={cx("preview-placeholder")}>
      尚無可預覽的內容
      <p className={cx("--label")}> 與Rita 交談，並預覽他幫您生成課程內容。</p>
    </div>
  );
}

export default PreviewSpace;
