import React, {ReactElement, ReactNode} from "react";
import classNames from "classnames/bind";
import styles from "./IconButton.module.scss";

const cx = classNames.bind(styles);
export type IconButtonProps = {
  flex?: boolean;
  mode?: string;
  text?: string;
  icon: ReactNode;
  onClick?: (
    e: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
    ...args: any[]
  ) => void;
  disabled?: boolean;
};
const IconButton = ({
  flex,
  mode = "",
  text,
  icon,
  onClick = () => {},
  disabled = false,
}: IconButtonProps) => {
  return (
    <div
      className={cx("icon-button", ...mode.split(" "), {
        flex: flex,
        disabled: disabled,
      })}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          if (e.repeat) return;
          if (disabled) return;
          onClick(e);
        }
      }}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if (disabled) return;
        onClick(e);
      }}
    >
      {text}
      <div className={cx("icon-wrapper")}>{icon}</div>
    </div>
  );
};

export default IconButton;
