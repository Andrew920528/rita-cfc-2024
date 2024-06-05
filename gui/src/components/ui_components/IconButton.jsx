import React from "react";

const IconButton = ({flex, mode, text, icon}) => {
  return (
    <div className={`icon-button ${flex ? "flex" : "fixed"} ${mode}`}>
      {text}
      <div className="icon-wrapper">{icon}</div>
    </div>
  );
};

export default IconButton;
