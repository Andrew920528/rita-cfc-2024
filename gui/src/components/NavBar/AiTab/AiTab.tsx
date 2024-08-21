import React from "react";

import classNames from "classnames/bind";
import styles from "./AiTab.module.scss";

const cx = classNames.bind(styles);

type Props = {};

function AiTab({}: Props) {
  return <div className={cx("ai-tab")}>AiTab</div>;
}

export default AiTab;
