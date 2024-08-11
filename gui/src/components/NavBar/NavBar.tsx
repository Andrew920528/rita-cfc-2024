import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import {Add, Information} from "@carbon/icons-react";
import IconButton from "../ui_components/IconButton/IconButton";
import ManageClassroomPU from "../PopUps/ManageClassroomPU/ManageClassroomPU";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {LecturesServices} from "../../features/LectureSlice";
import {WidgetType} from "../../schema/widget/widget";
import {initWidget, widgetBook} from "../../schema/widget/widgetFactory";
import {useCreateWidget} from "../../global/globalActions";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {API, EMPTY_ID} from "../../global/constants";
import {generateId} from "../../utils/util";
import {createWidgetService, useApiHandler} from "../../utils/service";
import classNames from "classnames/bind";
import styles from "./NavBar.module.scss";
import {WidgetsServices} from "../../features/WidgetsSlice";
import WidgetCard from "./WidgetCard/WidgetCard";

const cx = classNames.bind(styles);
type ClassCardProps = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  publisher?: string;
  plan?: boolean;
  selected?: string;
  credits: number;
};
const ClassCard = ({
  id = "",
  name = "新科目",
  subject = "未設定",
  grade = "未設定",
  publisher = "未設定",
  plan = false,
  selected = EMPTY_ID,
  credits,
}: ClassCardProps) => {
  const dispatch = useAppDispatch();
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  return (
    <div
      className={cx("class-card", {selected: selected === id})}
      onClick={() => {
        dispatch(ClassroomsServices.actions.setCurrent(id));
        const lastLecture = classrooms.dict[id].lastOpenedLecture;

        dispatch(
          LecturesServices.actions.setCurrent(
            lastLecture ? (lastLecture as string) : EMPTY_ID
          )
        );
        const chatId = classrooms.dict[id].chatroomId;
        dispatch(ChatroomsServices.actions.setCurrent(chatId));

        if (lastLecture) {
          const firstWidget = lectures.dict[lastLecture].widgetIds[0];
          if (firstWidget) {
            dispatch(WidgetsServices.actions.setCurrent(firstWidget));
          } else {
            dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
          }
        }
      }}
    >
      <p>
        <strong>{name}</strong>
      </p>
      <p className={cx("--label")}>
        科目：{subject} ｜年級：{grade}｜教材：{publisher}
        <br /> 週堂數：{credits} | 學期規劃：{plan ? "已完成" : "未完成"}
      </p>
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
    <div className={cx("navbar")}>
      <div className={cx("nav-classroom")}>
        <div className={cx("nav-heading")}>
          <p className={cx("--heading")}>教室</p>
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
        <div className={cx("nav-stack")}>
          {user.classroomIds.toReversed().map((id) => (
            <ClassCard
              key={id}
              id={id}
              name={classrooms.dict[id].name}
              publisher={classrooms.dict[id].publisher}
              subject={classrooms.dict[id].subject}
              grade={classrooms.dict[id].grade}
              selected={classrooms.current}
              credits={classrooms.dict[id].credits}
            />
          ))}
        </div>
      </div>

      <div className={cx("nav-widget")}>
        <div className={cx("nav-heading")}>
          <p className={cx("--heading")}>工具</p>
        </div>
        {lectures.current !== EMPTY_ID && (
          <div className={cx("nav-stack")}>
            {Object.values(WidgetType)
              .filter((key) => !isNaN(Number(key)))
              .map((type) => {
                let w = widgetBook(type as WidgetType);
                return (
                  <WidgetCard
                    key={w.title}
                    title={w.title}
                    hint={w.hint}
                    icon={w.icon}
                    widgetType={w.type}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
