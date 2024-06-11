import React from "react";

const PopUp = ({trigger, setTrigger, children}) => {
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
