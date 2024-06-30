import React, {useRef, useState, useEffect, ReactElement} from "react";
import classNames from "classnames/bind";
import styles from "./FloatingMenu.module.scss";

const cx = classNames.bind(styles);
type FloatingMenuProps = {
  content: import("react").ReactElement;
  mode?: string;
};
export const FloatingMenu = ({content, mode}: FloatingMenuProps) => {
  return <div className={cx("floating-menu", mode)}>{content}</div>;
};

type FloatingMenuButtonProps = {
  button: ReactElement;
  menuProps: FloatingMenuProps;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
  transformOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
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
}: FloatingMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent): void => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
      className={cx(
        "fm-button",
        `a-${anchorOrigin.horizontal}`,
        `a-${anchorOrigin.vertical}`,
        `t-${transformOrigin.horizontal}`,
        `t-${transformOrigin.vertical}`
      )}
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
        <div className={cx("fm-wrapper")}>
          <FloatingMenu {...menuProps} />
        </div>
      )}
    </div>
  );
};
