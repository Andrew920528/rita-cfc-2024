import {Close} from "@carbon/icons-react";
import React, {ReactNode} from "react";
import IconButton, {
  IconButtonProps,
} from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./PopUp.module.scss";

const cx = classNames.bind(styles);
export type PopUpProps = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  reset?: () => void;
  title: string;
  children?: ReactNode;
  cancel?: boolean;
  footerBtnProps?: IconButtonProps;
};
const PopUp = ({
  trigger,
  setTrigger,
  reset = () => {},
  title,
  children,
  cancel,
  footerBtnProps,
}: PopUpProps) => {
  if (!trigger) return <></>;
  return (
    <div className={cx("pop-up-wrapper")}>
      <div className={cx("pop-up")}>
        <div className={cx("pop-up-header")}>
          <p className={cx("--heading")}>{title}</p>

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
                  Cancel
                </p>
              )}
            </div>
            <div className={cx("pu-footer-children")}>
              <IconButton mode="primary" flex={true} {...footerBtnProps} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;