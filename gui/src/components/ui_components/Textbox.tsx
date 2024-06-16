import React from "react";

type TextboxProps = {
  flex?: boolean;
  mode?: string; // form
  placeholder?: string;
  label?: string;
  errorMsg?: string;
  value?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  type?: string;
};
const Textbox = ({
  flex,
  mode,
  type,
  placeholder = "enter text",
  errorMsg,
  label,
  value,
  onChange = () => {},
  autoFocus = false,
}: TextboxProps) => {
  return (
    <div className={`textbox ${flex ? "flex" : "fixed"} ${mode}`}>
      {label && <p className="tb-label --label">{label}</p>}
      <input
        className={`${errorMsg ? "error" : ""}`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoFocus={autoFocus}
        type={type}
      />
      {errorMsg && <p className="--error --label">{errorMsg}</p>}
    </div>
  );
};

export default Textbox;
