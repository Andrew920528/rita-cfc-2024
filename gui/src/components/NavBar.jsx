import React from "react";

const SubjectCard = () => {
  return <div className="subject-card">card</div>;
};

const WidgetCard = () => {
  return <div>card</div>;
};
const NavBar = () => {
  return (
    <div className="navbar">
      <div className="nav-subject">
        <div className="nav-heading">
          <p className="--heading">科目</p>
        </div>
        <div className="nav-stack">
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
        </div>
      </div>

      <div className="nav-widget">
        <div className="nav-heading">
          <p className="--heading">工具</p>
        </div>
        <div className="nav-stack">
          <WidgetCard />
          <WidgetCard />
          <WidgetCard />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
