import React from "react";

const SubjectCard = ({
  title = "新科目",
  subject = "未設定",
  grade = "未設定",
  content = "未設定",
  schedule = "未完成",
}) => {
  return (
    <div className="subject-card">
      <p>
        <strong>{title}</strong>
      </p>
      <p className="--label">
        科目：{subject} ｜年級：{grade}｜教材：{content}
        <br /> 學期規劃：{schedule}
      </p>
    </div>
  );
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
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          {/* <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard /> */}
        </div>
      </div>

      <div className="nav-widget">
        <div className="nav-heading">
          <p className="--heading">工具</p>
        </div>
        <div className="nav-stack">
          <WidgetCard />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
