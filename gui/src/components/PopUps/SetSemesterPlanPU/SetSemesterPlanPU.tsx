import React from "react";
import classNames from "classnames/bind";
import styles from "./SetSemesterPlanPU.module.scss";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
const cx = classNames.bind(styles);
type Props = {};

const SetSemesterPlanPU = (props: Props & PopUpProps) => {
  return (
    <PopUp {...props}>
      <div className={cx("content")}>Popup!</div>
    </PopUp>
  );
};

export default SetSemesterPlanPU;
