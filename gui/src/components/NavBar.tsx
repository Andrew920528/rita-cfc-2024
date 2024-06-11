import React, {Dispatch, SetStateAction, useState} from "react";
import {
  Add,
  Information,
  Catalog,
  CertificateCheck,
  Plan,
  Alarm,
} from "@carbon/icons-react";
import IconButton from "./ui_components/IconButton";
import PopUp from "./ui_components/PopUp";

type SubjectCard = {
  title?: string;
  subject?: string;
  grade?: string;
  content?: string;
  schedule?: string;
  selected?: string;
  setSelected?: Dispatch<SetStateAction<string>>;
  id?: string;
};
const SubjectCard = ({
  title = "新科目",
  subject = "未設定",
  grade = "未設定",
  content = "未設定",
  schedule = "未完成",
  selected = "-1",
  setSelected = () => {},
  id = "",
}: SubjectCard) => {
  return (
    <div
      className={`subject-card ${selected === id ? "selected" : ""}`}
      onClick={() => {
        setSelected(id);
      }}
    >
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

const WidgetCard = ({
  icon = <Catalog />,
  title = "新工具",
  hint = "新工具的提示",
  widget = <div className="empty-widget"></div>,
}) => {
  return (
    <div className="widget-card">
      <div className="widget-card-left">
        {icon}
        <p>
          <strong>{title}</strong>
        </p>
        <p className="--label">{hint}</p>
      </div>
      <div className="widget-card-right">
        <IconButton mode={"ghost"} icon={<Information />} />
        <IconButton mode={"primary"} icon={<Add />} />
      </div>
    </div>
  );
};

const subjectList = [
  {
    id: "001-001",
    title: "502 國文",
    subject: "國文",
    grade: "五上",
    content: "康軒",
    schedule: "已完成",
  },
  {
    id: "001-002",
    title: "502 校本秋季",
    subject: "綜合",
    grade: "五上",
    content: "彈性",
    schedule: "已完成",
  },
  {
    id: "001-003",
    title: "601 數學",
    subject: "數學",
    grade: "六上",
    content: "翰林",
    schedule: "未完成",
  },
];

const widgetList = [
  {title: "學習目標", hint: "列出學習重點", icon: <CertificateCheck />},
  {title: "進度表", hint: "製作學期進度", icon: <Plan />},
  {title: "筆記", hint: "快速整理想法", icon: <Catalog />},
  {title: "課表", hint: "瀏覽每週課表", icon: <Alarm />},
];

const SubjectCreation = () => {
  return <div className="subject-creation"></div>;
};

const NavBar = () => {
  const [subject, setSubject] = useState(
    subjectList.length > 0 ? subjectList[0].id : ""
  );
  const [openSubjectCreation, setOpenSubjectCreation] = useState(true);
  return (
    <div className="navbar">
      <div className="nav-subject">
        <div className="nav-heading">
          <p className="--heading">科目</p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"新增"}
            onClick={() => {
              setOpenSubjectCreation(true);
            }}
          />
          {/* <PopUp
            trigger={openSubjectCreation}
            setTrigger={setOpenSubjectCreation}
          >
            fefef
          </PopUp> */}
        </div>
        <div className="nav-stack">
          {subjectList.map((_, ind) => (
            <SubjectCard
              key={subjectList[ind].id}
              id={subjectList[ind].id}
              title={subjectList[ind].title}
              selected={subject}
              setSelected={setSubject}
            />
          ))}
        </div>
      </div>

      <div className="nav-widget">
        <div className="nav-heading">
          <p className="--heading">工具</p>
        </div>
        <div className="nav-stack">
          {widgetList.map((_, ind) => (
            <WidgetCard
              key={widgetList[ind].title}
              title={widgetList[ind].title}
              hint={widgetList[ind].hint}
              icon={widgetList[ind].icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
