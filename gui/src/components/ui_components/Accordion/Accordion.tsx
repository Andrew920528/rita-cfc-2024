import React, {ReactElement, useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./Accordion.module.scss";
import IconButton from "../IconButton/IconButton";
import {ChevronDown, ChevronRight, ChevronUp} from "@carbon/icons-react";
const cx = classNames.bind(styles);
type Props = {
  id?: string;
  header: ReactElement;
  content: ReactElement;
  initialOpen?: boolean;
};

function Accordion({id, header, content, initialOpen = true}: Props) {
  const [open, setOpen] = useState<boolean>(() => {
    if (!id) return initialOpen;
    const savedState = sessionStorage.getItem(id);
    return savedState ? JSON.parse(savedState) : initialOpen;
  });
  useEffect(() => {
    if (!id) return;
    sessionStorage.setItem(id, JSON.stringify(open));
  }, [id, open]);
  return (
    <div>
      <div className={cx("accordion-header", open && "active")}>
        {header}
        <IconButton
          icon={open ? <ChevronDown /> : <ChevronRight />}
          mode="ghost"
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className={cx("accordion-content", {collapsed: !open})}>
        {content}
      </div>
    </div>
  );
}

export default Accordion;
