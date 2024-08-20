import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./CourseTab.module.scss";
import IconButton from "../../ui_components/IconButton/IconButton";
import {Add} from "@carbon/icons-react";
import {EMPTY_ID} from "../../../global/constants";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {ClassroomsServices} from "../../../features/ClassroomsSlice";
import {LecturesServices} from "../../../features/LectureSlice";
import {ChatroomsServices} from "../../../features/ChatroomsSlice";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import ManageClassroomPU from "../../PopUps/ManageClassroomPU/ManageClassroomPU";
type Props = {};
const cx = classNames.bind(styles);
const CourseTab = (props: Props) => {
  const [openClassroomCreation, setOpenClassroomCreation] = useState(false);
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  return (
    <div className={cx("course-tab")}>
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
  );
};

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

export default CourseTab;
