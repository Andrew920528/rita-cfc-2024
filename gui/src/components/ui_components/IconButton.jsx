import React from "react";

const IconButton = ({flex, mode, text, icon, onClick = () => {}}) => {
  return (
    <div
      className={`icon-button ${flex ? "flex" : "fixed"} ${mode}`}
      onClick={onClick}
    >
      {text}
      <div className="icon-wrapper">{icon}</div>
    </div>
  );
};

export default IconButton;
