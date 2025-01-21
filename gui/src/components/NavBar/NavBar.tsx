import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import classNames from "classnames/bind";
import styles from "./NavBar.module.scss";
import Tabs from "../ui_components/Tabs/Tabs";
import CourseTab from "./CourseTab/CourseTab";
import ToolTab from "./ToolTab/ToolTab";
import {useTypedSelector} from "../../store/store";
import {EMPTY_ID} from "../../global/constants";
import AiTab from "./AiTab/AiTab";

const cx = classNames.bind(styles);

const NavBar = () => {
  // global states
  let noLecture = useTypedSelector(
    (state) => state.Lectures.current === EMPTY_ID
  );

  const NavContent = React.memo(({children}: {children: ReactElement}) => {
    return <div className={cx("nav-content")}>{children}</div>;
  });

  return (
    <div className={cx("navbar")}>
      <Tabs
        items={[
          {title: "Course", content: <NavContent children={<CourseTab />} />},
          {
            title: "Widgets",
            content: <NavContent children={<ToolTab />} />,
            disabled: noLecture,
          },
          {
            title: "Rita AI",
            content: <NavContent children={<AiTab />} />,
            disabled: noLecture,
          },
        ]}
      />
    </div>
  );
};

export default React.memo(NavBar);
