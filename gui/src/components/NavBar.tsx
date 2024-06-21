import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import {Add, Information} from "@carbon/icons-react";
import IconButton from "./ui_components/IconButton";
import ManageClassroomPU from "./PopUps/ManageClassroomPU";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {LecturesServices} from "../features/LectureSlice";
import {WidgetType, initWidget, widgetBook} from "../schema/widget";
import {useCreateWidget} from "../store/globalActions";

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
  const classrooms = useTypedSelector((state) => state.Classrooms);
  return (
    <div
      className={`class-card ${selected === id ? "selected" : ""}`}
      onClick={() => {
        dispatch(ClassroomsServices.actions.setCurrent(id));
        dispatch(
          LecturesServices.actions.setCurrent(
            classrooms.dict[id].lastOpenedLecture
          )
        );
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
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
};
const WidgetCard = ({icon, title, hint, widgetType}: WidgetCardProps) => {
  const lectures = useTypedSelector((state) => state.Lectures);
  const addWidget = useCreateWidget();

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
        <IconButton
          mode={"primary"}
          icon={<Add />}
          onClick={() => {
            addWidget({widgetType: widgetType, lectureId: lectures.current});
          }}
        />
      </div>
    </div>
  );
};

const NavBar = () => {
  // global states
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  const [openClassroomCreation, setOpenClassroomCreation] = useState(false);
  return (
    <div className="navbar">
      <div className="nav-classroom">
        <div className="nav-heading">
          <p className="--heading">教室</p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"新增"}
            onClick={() => {
              setOpenClassroomCreation(true);
            }}
          />
          <ManageClassroomPU
            trigger={openClassroomCreation}
            setTrigger={setOpenClassroomCreation}
            title={"創建教室"}
            action="create"
          />
        </div>
        <div className="nav-stack">
          {user.classrooms.toReversed().map((id) => (
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
        {lectures.current !== "NONE" && (
          <div className="nav-stack">
            {Object.values(widgetBook).map((w) => (
              <WidgetCard
                key={w.title}
                title={w.title}
                hint={w.hint}
                icon={w.icon}
                widgetType={w.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
