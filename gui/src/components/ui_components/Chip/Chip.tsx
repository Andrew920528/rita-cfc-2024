import React, {ReactNode} from "react";
import classNames from "classnames/bind";
import styles from "./Chip.module.scss";

const cx = classNames.bind(styles);
const Chip = ({
  text,
  icon,
  mode,
  iconColor = "black",
  onClick = () => {},
}: {
  text: string;
  icon?: ReactNode;
  mode?: string;
  iconColor?: string;
  onClick?: () => void;
}) => {
  return (
    <div className={cx("chip", mode)} onClick={onClick}>
      <div className={cx("chip-icon")} style={{color: iconColor}}>
        {icon}
      </div>
      <p>{text}</p>
    </div>
  );
};

export default Chip;
