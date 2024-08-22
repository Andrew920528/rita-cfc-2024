import React, {useEffect, useState} from "react";

import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import {useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import NavBar from "../../components/NavBar/NavBar";

const cx = classNames.bind(styles);
const Home = () => {
  const [openNav, setOpenNav] = useState<boolean>(true);
  const user = useTypedSelector((state) => state.User);

  const [navWidth, setNavWidth] = useState<number>(300);
  const minNavWidth = 300;
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const start = e.clientX;
    document.body.style.cursor = "col-resize";

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - start;
      let newWidth = navWidth + delta;
      newWidth = Math.max(minNavWidth, newWidth);
      setNavWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!user.username) {
    return;
  }
  return (
    <div className={cx("home")}>
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <div className={cx("home-content")}>
        <div
          className={cx("navbar-wrapper", {collapsed: !openNav})}
          style={{width: `${navWidth}px`}}
        >
          <NavBar />
        </div>
        <div onMouseDown={(e) => handleMouseDown(e)} className={cx("handle")} />

        <div className={cx("dashboard-wrapper")}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Home;
