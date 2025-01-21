import {Close} from "@carbon/icons-react";
import React, {ReactNode, useEffect} from "react";
import IconButton, {
  IconButtonProps,
} from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./PopUp.module.scss";
import {TText} from "../../TText/TText";

const cx = classNames.bind(styles);
export type PopUpProps = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  reset?: () => void;
  title: string;
  children?: ReactNode;
  cancel?: boolean;
  footerBtnProps?: IconButtonProps;
  puAction?: () => void;
  isComposing?: boolean;
};
const PopUp = ({
  trigger,
  setTrigger,
  reset = () => {},
  title,
  children,
  cancel,
  footerBtnProps,
  puAction,
  isComposing,
}: PopUpProps) => {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (trigger && event.key === "Enter" && puAction) {
        if (isComposing) return;
        puAction();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [puAction, trigger, isComposing]);
  if (!trigger) return <></>;
  return (
    <div className={cx("pop-up-wrapper")}>
      <div className={cx("pop-up")}>
        <div className={cx("pop-up-header")}>
          <p className={cx("--heading")}>
            <TText>{title}</TText>
          </p>

          <IconButton
            icon={<Close size={20} />}
            mode="ghost"
            onClick={() => {
              reset();
              setTrigger(false);
            }}
          />
        </div>
        <div className={cx("pu-content")}>{children}</div>
        {footerBtnProps && (
          <div className={cx("pu-footer")}>
            <div className={cx("pu-footer-children", "cancel-btn")}>
              {cancel && (
                <p
                  className={cx("cancel")}
                  onClick={() => {
                    reset();
                    setTrigger(false);
                  }}
                >
                  <TText>Cancel</TText>
                </p>
              )}
            </div>
            {puAction && (
              <div className={cx("pu-footer-children")}>
                <IconButton
                  mode="primary"
                  flex={true}
                  {...footerBtnProps}
                  onClick={puAction}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;
