import React, {useState} from "react";

type TextAreaProps = {
  flex?: boolean;
  placeholder?: string;
  mode?: "single" | "list";
  label?: string;
  value?: string;
  valuelist?: string[];
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeList?: (index: number, value: string) => void;
};

const TextArea: React.FC<TextAreaProps> = ({
    flex,
    placeholder = "寫下筆記、想法...",
    label,
    value,
    valuelist,
    mode = "single",
    onChange = () => {},
    onChangeList = () => {},
  }) => {
    const splitByNewline = (text: string) => text.split('\n');
    return (
      <div className={`textarea-wrapper ${flex ? "flex" : "fixed"}`}>
        {label && <label>{label}</label>}
        {mode === "single" && (
          <textarea
            className="textarea-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}
        {mode === "list" &&
          valuelist &&
          valuelist.map((val, index) => (
          <textarea
            className="textarea-input"
            placeholder={placeholder}
            value={valuelist ? valuelist.join('\n') : ''}
            onChange={(e) => {
                const newValueList = splitByNewline(e.currentTarget.value);
                newValueList.forEach((val, index) => onChangeList(index, val));
          }}
        />
          ))}
      </div>
    );
  };
  
  export default TextArea;