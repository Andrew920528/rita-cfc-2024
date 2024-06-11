import React, {ReactNode} from "react";

type PopUpProps = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  children: ReactNode;
};
const PopUp = ({trigger, setTrigger, children}: PopUpProps) => {
  return trigger ? (
    <div className="pop-up">
      {children}
      <div className="background"></div>
    </div>
  ) : (
    <></>
  );
};

export default PopUp;
