import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import {
  Add,
  Information,
  Catalog,
  CertificateCheck,
  Plan,
  Alarm,
} from "@carbon/icons-react";
import IconButton from "./ui_components/IconButton";
import CreateClassroomPU from "./PopUps/CreateClassroomPU";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {ClassroomsServices} from "../features/ClassroomsSlice";

type ClassCardProps = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  publisher?: string;
  plan?: boolean;
  selected?: string;
};
const ClassCard = ({
  id = "",
  name = "新科目",
  subject = "未設定",
  grade = "未設定",
  publisher = "未設定",
  plan = false,
  selected = "NONE",
}: ClassCardProps) => {
  const dispatch = useAppDispatch();
  return (
    <div
      className={`class-card ${selected === id ? "selected" : ""}`}
      onClick={() => {
        dispatch(ClassroomsServices.actions.setCurrent(id));
      }}
    >
      <p>
        <strong>{name}</strong>
      </p>
      <p className="--label">
        科目：{subject} ｜年級：{grade}｜教材：{publisher}
        <br /> 學期規劃：{plan ? "已完成" : "未完成"}
      </p>
    </div>
  );
};

type WidgetCardProps = {
  icon?: ReactElement;
  title?: string;
  hint?: string;
  widget?: ReactElement;
};
const WidgetCard = ({
  icon = <Catalog />,
  title = "新工具",
  hint = "新工具的提示",
  widget = <div className="empty-widget"></div>,
}: WidgetCardProps) => {
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

const widgetList = [
  {title: "學習目標", hint: "列出學習重點", icon: <CertificateCheck />},
  {title: "進度表", hint: "製作學期進度", icon: <Plan />},
  {title: "筆記", hint: "快速整理想法", icon: <Catalog />},
  {title: "課表", hint: "瀏覽每週課表", icon: <Alarm />},
];

const NavBar = () => {
  // global states
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);

  const [openSubjectCreation, setOpenSubjectCreation] = useState(false);
  return (
    <div className="navbar">
      <div className="nav-subject">
        <div className="nav-heading">
          <p className="--heading">教室</p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"新增"}
            onClick={() => {
              setOpenSubjectCreation(true);
            }}
          />
          <CreateClassroomPU
            trigger={openSubjectCreation}
            setTrigger={setOpenSubjectCreation}
            title={"創建教室"}
          />
        </div>
        <div className="nav-stack">
          {user.classrooms.map((id) => (
            <ClassCard
              key={id}
              id={id}
              name={classrooms.dict[id].name}
              publisher={classrooms.dict[id].publisher}
              subject={classrooms.dict[id].subject}
              grade={classrooms.dict[id].grade}
              selected={classrooms.current}
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
