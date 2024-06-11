import React from "react";

type TextboxProps = {
  flex?: boolean;
  mode?: string;
  placeholder?: string;
};
const Textbox = ({
  flex,
  mode = "",
  placeholder = "enter text",
}: TextboxProps) => {
  return (
    <div className={`textbox ${flex ? "flex" : "fixed"} ${mode}`}>
      <input placeholder={placeholder} />
    </div>
  );
};

export default Textbox;
