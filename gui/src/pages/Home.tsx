import React, {useEffect, useState} from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Dashboard from "../components/Dashboard";

const Home = () => {
  const [openNav, setOpenNav] = useState<boolean>(true);
  return (
    <div className="home">
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <div className="home-content">
        <div className={`navbar-wrapper ${openNav ? "opened" : "collapsed"}`}>
          <NavBar />
        </div>

        <div className="dashboard-wrapper">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Home;
