import React, { useState } from 'react';

type TextAreaProps = {
    flex?: boolean;
    placeholder?: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  };
  
  const TextArea: React.FC<TextAreaProps> = ({
    flex,
    placeholder = "寫下筆記、想法...",
    label,
    value,
    onChange = () => {},

  }) => {
    return (
      <div className={`textarea-wrapper ${flex ? "flex" : "fixed"}`}>
        {label && <label>{label}</label>}
        <textarea
          className='textarea-input'
          placeholder={placeholder}
          value={value}
          onChange={onChange}

        />
      </div>
    );
  };
  
  export default TextArea;
