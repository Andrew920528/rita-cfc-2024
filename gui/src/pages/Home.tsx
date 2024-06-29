import React, {useEffect, useState} from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Dashboard from "../components/Dashboard";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "../store/store";

const Home = () => {
  const [openNav, setOpenNav] = useState<boolean>(true);
  const user = useTypedSelector((state) => state.User);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("home rendered");
    if (!user.username) {
      navigate("/login");
    }
  }, []);
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
