import React, {useRef, useState, useEffect} from "react";

export const FloatingMenu = ({content, mode}) => {
  return <div className={`floating-menu ${mode}`}>{content}</div>;
};

export const FloatingMenuButton = ({
  button,
  menuProps,
  anchorOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fm-button a-${anchorOrigin.horizontal} a-${anchorOrigin.vertical} t-${transformOrigin.horizontal} t-${transformOrigin.vertical}`}
      ref={menuRef}
    >
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {button}
      </div>

      {isOpen && (
        <div className="fm-wrapper">
          <FloatingMenu {...menuProps} />
        </div>
      )}
    </div>
  );
};
