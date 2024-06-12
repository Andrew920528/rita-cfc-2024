import {Close} from "@carbon/icons-react";
import React, {ReactNode} from "react";
import IconButton from "./IconButton";

type PopUpProps = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  title: string;
  children?: ReactNode;
};
const PopUp = ({trigger, setTrigger, title, children}: PopUpProps) => {
  if (!trigger) return <></>;
  return (
    <div className="pop-up-background">
      <div className="pop-up">
        <div className="pop-up-header">
          <p className="--heading">{title}</p>

          <IconButton
            icon={<Close size={20} />}
            mode="ghost"
            onClick={() => {
              setTrigger(false);
            }}
          />
        </div>
        <div className="pu-">{children}</div>content
      </div>
    </div>
  );
};

export default PopUp;
