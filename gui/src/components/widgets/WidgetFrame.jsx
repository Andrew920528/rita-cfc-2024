import React from "react";
import {Catalog} from "@carbon/icons-react";

const WidgetFrame = ({
  selected,
  icon = <Catalog size={20} />,
  title = "Widget",
  children,
}) => {
  return (
    <div className={`widget-frame ${selected ? "selected" : "idle"}`}>
      <div className="wf-heading">
        {icon}
        <p className="--heading">{title}</p>
      </div>
      {children}
    </div>
  );
};

export default WidgetFrame;
