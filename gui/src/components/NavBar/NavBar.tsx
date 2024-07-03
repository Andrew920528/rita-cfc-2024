import React, {Dispatch, ReactElement, SetStateAction, useState} from "react";
import {Add, Information} from "@carbon/icons-react";
import IconButton from "../ui_components/IconButton/IconButton";
import ManageClassroomPU from "../PopUps/ManageClassroomPU/ManageClassroomPU";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {LecturesServices} from "../../features/LectureSlice";
import {WidgetType, initWidget, widgetBook} from "../../schema/widget";
import {useCreateWidget} from "../../store/globalActions";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {API_ERROR, EMPTY_ID} from "../../global/constants";
import {generateId} from "../../utils/util";
import {createWidgetService, useApiHandler} from "../../utils/service";
import classNames from "classnames/bind";
import styles from "./NavBar.module.scss";

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
  return (
    <div
      className={cx("class-card", {selected: selected === id})}
      onClick={() => {
        dispatch(ClassroomsServices.actions.setCurrent(id));
        dispatch(
          LecturesServices.actions.setCurrent(
            classrooms.dict[id].lastOpenedLecture
              ? (classrooms.dict[id].lastOpenedLecture as string)
              : EMPTY_ID
          )
        );
        const chatId = classrooms.dict[id].chatroom;
        dispatch(ChatroomsServices.actions.setCurrent(chatId));
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

type WidgetCardProps = {
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
};
const WidgetCard = ({icon, title, hint, widgetType}: WidgetCardProps) => {
  const lectures = useTypedSelector((state) => state.Lectures);
  const username = useTypedSelector((state) => state.User.username);
  const addWidget = useCreateWidget();
  const {apiHandler, loading} = useApiHandler();
  // TODO DELETE
  const widgets = useTypedSelector((state) => state.Widgets);
  async function createWidget() {
    const newWidgetId = username + "-wid-" + generateId();
    let r = await apiHandler({
      apiFunction: (s) =>
        createWidgetService(s, {
          widgetId: newWidgetId,
          type: widgetType,
          lectureId: lectures.current,
          content: JSON.stringify(initWidget(newWidgetId, widgetType).content), // TODO Needs to save initial content
        }),
      debug: true,
      identifier: "createWidget",
    });
    if (r.status === API_ERROR) {
      return;
    }
    addWidget({
      widgetType: widgetType,
      lectureId: lectures.current,
      widgetId: newWidgetId,
    });
    console.log(widgets.unsaved);
  }
  return (
    <div className={cx("widget-card")}>
      <div className={cx("widget-card-left")}>
        {icon}
        <p>
          <strong>{title}</strong>
        </p>
        <p className={cx("--label")}>{hint}</p>
      </div>
      <div className={cx("widget-card-right")}>
        <IconButton mode={"ghost"} icon={<Information />} />
        <IconButton
          mode={"primary"}
          icon={<Add />}
          onClick={async () => {
            await createWidget();
          }}
          disabled={loading}
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
