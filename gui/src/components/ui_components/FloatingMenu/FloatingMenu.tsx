import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  useCallback,
} from "react";
import classNames from "classnames/bind";
import styles from "./FloatingMenu.module.scss";

const cx = classNames.bind(styles);

type FloatingMenuProps = {
  content: ReactElement;
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
  const [menuPosition, setMenuPosition] = useState<{top: number; left: number}>(
    {top: 0, left: 0}
  );
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updateMenuPosition = useCallback(() => {
    if (buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const offset = 0; // Offset from the button

      let top = 0;
      let left = 0;

      switch (anchorOrigin.vertical) {
        case "top":
          top = buttonRect.top - menuRect.height - offset;
          break;
        case "bottom":
          top = buttonRect.bottom + offset;
          break;
      }

      switch (anchorOrigin.horizontal) {
        case "left":
          left = buttonRect.left;
          break;
        case "right":
          left = buttonRect.right - menuRect.width;
          break;
      }

      setMenuPosition({top, left});
    }
  }, [anchorOrigin, buttonRef, menuRef]);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
    }
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (isOpen) {
        updateMenuPosition();
      }
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div
      className={cx(
        "fm-button",
        `a-${anchorOrigin.horizontal}`,
        `a-${anchorOrigin.vertical}`,
        `t-${transformOrigin.horizontal}`,
        `t-${transformOrigin.vertical}`
      )}
      ref={buttonRef}
    >
      <div onClick={() => setIsOpen(!isOpen)}>{button}</div>

      {isOpen && (
        <div
          className={cx("fm-wrapper")}
          style={{
            position: "absolute",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          ref={menuRef}
        >
          <FloatingMenu {...menuProps} />
        </div>
      )}
    </div>
  );
};
