import React, {ReactElement} from "react";
import {Catalog} from "@carbon/icons-react";

type WidgetFrameProps = {
  selected?: boolean;
  icon?: ReactElement;
  title?: string;
  children?: ReactElement | null;
};
const WidgetFrame = ({
  selected,
  icon = <Catalog size={20} />,
  title = "Widget",
  children,
}: WidgetFrameProps) => {
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
