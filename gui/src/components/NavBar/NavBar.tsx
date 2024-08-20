import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import classNames from "classnames/bind";
import styles from "./NavBar.module.scss";
import Tabs from "../ui_components/Tabs/Tabs";
import CourseTab from "./CourseTab/CourseTab";
import ToolTab from "./ToolTab/ToolTab";

const cx = classNames.bind(styles);

const NavBar = () => {
  // global states

  const NavContent = ({children}: {children: ReactElement}) => {
    return <div className={cx("nav-content")}>{children}</div>;
  };

  return (
    <div className={cx("navbar")}>
      <Tabs
        items={[
          {title: "課程", content: <NavContent children={<CourseTab />} />},
          {title: "工具", content: <NavContent children={<ToolTab />} />},
          {title: "Rita 小助教", content: <NavContent children={<div />} />},
        ]}
      />
    </div>
  );
};

export default NavBar;
