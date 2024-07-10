import React from "react";
import IconButton from "../IconButton/IconButton";
import {View, ViewOff} from "@carbon/icons-react";
import classNames from "classnames/bind";
import styles from "./Textbox.module.scss";

const cx = classNames.bind(styles);
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
} & React.InputHTMLAttributes<HTMLInputElement>;
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
  ...rest
}: TextboxProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className={cx("textbox", mode, {flex: flex})}>
      {label && <p className={cx("tb-label", "--label")}>{label}</p>}
      <div className={cx("input-content-wrapper")}>
        <input
          className={cx({error: errorMsg}, type)}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          autoFocus={autoFocus}
          type={showPassword && type === "password" ? "text" : type}
          aria-label={ariaLabel}
          {...rest}
        />
        {type === "password" && (
          <div className={cx("btn")}>
            <IconButton
              mode="ghost"
              icon={showPassword ? <ViewOff /> : <View />}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        )}
      </div>
      {errorMsg && <p className={cx("--error", "--label")}>{errorMsg}</p>}
    </div>
  );
};

export default Textbox;
