import React from "react";

const Textbox = ({flex, mode = "", placeholder = "enter text"}) => {
  return (
    <div className={`textbox ${flex ? "flex" : "fixed"} ${mode}`}>
      <input placeholder={placeholder} />
    </div>
  );
};

export default Textbox;
