import React from "react";
import classNames from "classnames/bind";
import styles from "./PreviewSpace.module.scss";
import IconButton from "../../../ui_components/IconButton/IconButton";
import {MagicWand} from "@carbon/icons-react";
import {WidgetContent} from "../../../../schema/widget/widget";
const cx = classNames.bind(styles);
type Props = {
  widgetContent?: WidgetContent;
};

const PreviewSpace = (props: Props) => {
  return (
    <div>
      PreviewSpace
      <IconButton icon={<MagicWand />} text="套用" mode="primary" />
    </div>
  );
};

export default PreviewSpace;
