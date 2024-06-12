import {Close} from "@carbon/icons-react";
import React, {ReactNode} from "react";
import IconButton, {IconButtonProps} from "../ui_components/IconButton";

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
    <div className="pop-up-wrapper">
      <div className="pop-up">
        <div className="pop-up-header">
          <p className="--heading">{title}</p>

          <IconButton
            icon={<Close size={20} />}
            mode="ghost"
            onClick={() => {
              reset();
              setTrigger(false);
            }}
          />
        </div>
        <div className="pu-content">{children}</div>
        {footerBtnProps && (
          <div className="pu-footer">
            <div className="pu-footer-children cancel-btn">
              {cancel && (
                <p
                  className="cancel"
                  onClick={() => {
                    reset();
                    setTrigger(false);
                  }}
                >
                  Cancel
                </p>
              )}
            </div>
            <div className="pu-footer-children">
              <IconButton mode="primary" flex={true} {...footerBtnProps} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;
