import React from "react";
import classNames from "classnames/bind";
import styles from "./PreviewSpace.module.scss";
import IconButton from "../../../ui_components/IconButton/IconButton";
import {MagicWand} from "@carbon/icons-react";
import {WidgetContent} from "../../../../schema/widget/widget";
import {useTypedSelector} from "../../../../store/store";
import {EMPTY_ID} from "../../../../global/constants";
import WidgetFrame from "../../../widgets/WidgetFrame/WidgetFrame";

const cx = classNames.bind(styles);
type Props = {};

const PreviewSpace = (props: Props) => {
  const widgets = useTypedSelector((state) => state.Widgets);
  return (
    <div className={cx("preview-space")}>
      <div>預覽</div>
      <div className={cx("preview-content")}>
        {widgets.current === EMPTY_ID ? (
          <>No Preview Available</>
        ) : (
          <>
            <div>{JSON.stringify(widgets.dict[widgets.current].type)}</div>
            <div>{JSON.stringify(widgets.previewDict[widgets.current])}</div>
          </>
        )}
      </div>

      <div>
        <IconButton icon={<MagicWand />} text="套用" mode="primary" />
      </div>
    </div>
  );
};

function PreviewSpaceContent() {
  return <div>content</div>;
}

export default PreviewSpace;
