import React, {ReactElement, ReactNode} from "react";

export type IconButtonProps = {
  flex?: boolean;
  mode?: string;
  text?: string;
  icon: ReactNode;
  onClick?: (args?: any) => void;
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
      className={`icon-button ${flex ? "flex" : "fixed"} ${mode} ${
        disabled ? "disabled" : ""
      }`}
      onClick={() => {
        onClick();
      }}
    >
      {text}
      <div className="icon-wrapper">{icon}</div>
    </div>
  );
};

export default IconButton;
