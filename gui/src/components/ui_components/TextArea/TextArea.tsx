import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./TextArea.module.scss";

const cx = classNames.bind(styles);
type TextAreaProps = {
  flex?: boolean;
  placeholder?: string;
  mode?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextArea: React.FC<TextAreaProps> = ({
  flex,
  placeholder = "寫下筆記、想法...",
  label,
  value,
  mode = "default",
  onChange = () => {},
}) => {
  return (
    <div className={cx("textarea-wrapper", mode, {flex: flex})}>
      {label && <label>{label}</label>}
      <textarea
        className={cx("textarea-input")}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextArea;
