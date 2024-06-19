import React, { useState } from 'react';

type TextAreaProps = {
    flex?: boolean;
    placeholder?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    cols?: number;
  };
  
  const TextArea: React.FC<TextAreaProps> = ({
    flex,
    placeholder = "寫下筆記、想法...",
    label,
    value,
    onChange = () => {},
    rows = 10,
    cols = 60,
  }) => {
    return (
      <div className={`textarea-wrapper ${flex ? "flex" : "fixed"}`}>
        {label && <label>{label}</label>}
        <textarea
          className='textarea-input'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          cols={cols}
        />
      </div>
    );
  };
  
  export default TextArea;
