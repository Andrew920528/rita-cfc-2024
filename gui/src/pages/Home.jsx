import React from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <div className="home-content">
        <div className="navbar-wrapper">
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
