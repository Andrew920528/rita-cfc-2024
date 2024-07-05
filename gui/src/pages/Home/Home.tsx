import React, {useEffect, useState} from "react";

import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import Dashboard from "../../components/Dashboard/Dashboard";
import {useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);
const Home = () => {
  const [openNav, setOpenNav] = useState<boolean>(true);
  const user = useTypedSelector((state) => state.User);

  if (!user.username) {
    return;
  }
  return (
    <div className={cx("home")}>
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <div className={cx("home-content")}>
        <div className={cx("navbar-wrapper", {collapsed: !openNav})}>
          <NavBar />
        </div>

        <div className={cx("dashboard-wrapper")}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Home;
