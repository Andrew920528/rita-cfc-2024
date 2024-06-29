import React from "react";
import IconButton from "./IconButton/IconButton";
import {View, ViewOff} from "@carbon/icons-react";

type TextboxProps = {
  flex?: boolean;
  mode?: string; // form
  placeholder?: string;
  label?: string;
  errorMsg?: string;
  value?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  type?: string; // password, etc.
  ariaLabel?: string;
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
  ariaLabel = "Textbox",
}: TextboxProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className={`textbox ${flex ? "flex" : "fixed"} ${mode} `}>
      {label && <p className="tb-label --label">{label}</p>}
      <div className="input-content-wrapper">
        <input
          className={`${errorMsg ? "error" : ""} ${type}`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          autoFocus={autoFocus}
          type={showPassword && type === "password" ? "text" : type}
          aria-label={ariaLabel}
        />
        {type === "password" && (
          <div className="btn">
            <IconButton
              mode="ghost"
              icon={showPassword ? <ViewOff /> : <View />}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        )}
      </div>
      {errorMsg && <p className="--error --label">{errorMsg}</p>}
    </div>
  );
};

export default Textbox;
