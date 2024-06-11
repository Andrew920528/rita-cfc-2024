import React, {ReactElement} from "react";

type IconButtonProps = {
  flex?: boolean;
  mode?: string;
  text?: string;
  icon?: ReactElement;
  onClick?: (args?: any) => void;
};
const IconButton = ({
  flex,
  mode = "",
  text,
  icon,
  onClick = () => {},
}: IconButtonProps) => {
  return (
    <div
      className={`icon-button ${flex ? "flex" : "fixed"} ${mode}`}
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
