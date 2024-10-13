import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./CourseTab.module.scss";
import IconButton from "../../ui_components/IconButton/IconButton";
import {
  Add,
  Delete,
  Edit,
  Gears,
  Settings,
  TrashCan,
} from "@carbon/icons-react";
import {EMPTY_ID} from "../../../global/constants";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {ClassroomsServices} from "../../../features/ClassroomsSlice";
import {LecturesServices} from "../../../features/LectureSlice";
import {ChatroomsServices} from "../../../features/ChatroomsSlice";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import ManageClassroomPU from "../../PopUps/ManageClassroomPU/ManageClassroomPU";
import ManageLecturePU from "../../PopUps/ManageLecturePU/ManageLecturePU";
import {
  FloatingMenu,
  FloatingMenuButton,
} from "../../ui_components/FloatingMenu/FloatingMenu";
import DeleteClassroomPU from "../../PopUps/DeleteClassroomPU/DeleteClassroomPU";
import DeleteLecturePU from "../../PopUps/DeleteLecturePU/DeleteLecturePU";
import {CircularProgress} from "@mui/material";
import useVerticalHandle from "../VerticalHandle/VerticalHandle";
type Props = {};
const cx = classNames.bind(styles);
const CourseTab = (props: Props) => {
  const [openClassroomCreation, setOpenClassroomCreation] = useState(false);
  const [openLectureCreation, setOpenLectureCreation] = useState(false);
  const lectures = useTypedSelector((state) => state.Lectures);
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const {VerticalHandle, mainHeight} = useVerticalHandle({unit: "percent"});
  return (
    <div className={cx("course-tab")}>
      <div
        className={cx("tab-section", "classroom-section")}
        style={{height: `${mainHeight}%`}}
      >
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
          {user.classroomIds.length === 0 && (
            <div className={cx("placeholder")}>請新增教室開始備課</div>
          )}
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
              loading={classrooms.loading[id]}
            />
          ))}
        </div>
      </div>
      <VerticalHandle />
      {/* =========== Lecture Section =========== */}
      <div
        className={cx("tab-section", "lecture-section")}
        style={{height: `${100 - mainHeight}%`}}
      >
        <div className={cx("nav-heading")}>
          <p className={cx("--heading")}>計畫</p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"新增"}
            onClick={() => {
              setOpenLectureCreation(true);
            }}
            disabled={
              user.classroomIds.length === 0 || classrooms.current === EMPTY_ID
            }
          />
          <ManageLecturePU
            trigger={openLectureCreation}
            setTrigger={setOpenLectureCreation}
            title={"新增計畫"}
            action="create"
          />
        </div>
        <div className={cx("nav-stack")}>
          {classrooms.current !== EMPTY_ID &&
            classrooms.dict[classrooms.current].lectureIds.map((id) => (
              <LectureCard
                key={id}
                id={id}
                name={lectures.dict[id].name}
                selected={lectures.current}
                loading={lectures.loading[id]}
              />
            ))}
        </div>
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
  loading?: boolean;
};

const ClassCard = ({
  id = "",
  name = "新科目",
  subject = "未設定",
  grade = "未設定",
  publisher = "未設定",
  plan = false,
  selected = EMPTY_ID,
  loading = false,
  credits,
}: ClassCardProps) => {
  const dispatch = useAppDispatch();
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  function clickOnCard() {
    dispatch(ClassroomsServices.actions.setCurrent(id));
    const lastLecture = classrooms.dict[id].lastOpenedLecture;

    dispatch(
      LecturesServices.actions.setCurrent(
        lastLecture ? (lastLecture as string) : EMPTY_ID
      )
    );

    if (lastLecture) {
      const firstWidget = lectures.dict[lastLecture].widgetIds[0];
      if (firstWidget) {
        dispatch(WidgetsServices.actions.setCurrent(firstWidget));
      } else {
        dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
      }
    }
  }
  const [openClassroomModify, setOpenClassroomModify] = useState(false);
  const [openClassroomDelete, setOpenClassroomDelete] = useState(false);
  const ClassroomSettings = () => {
    return (
      <div className={cx("settings-fm")}>
        <IconButton
          icon={<Edit />}
          text="編輯"
          mode={"ghost"}
          onClick={() => {
            setOpenClassroomModify(true);
          }}
        />
        <IconButton
          icon={<TrashCan />}
          text="刪除"
          mode={"danger-ghost"}
          onClick={() => {
            setOpenClassroomDelete(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className={cx("class-card", {selected: selected === id, loading})}>
      <div
        className={cx("class-card-words")}
        onClick={() => {
          if (loading) return;

          clickOnCard();
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
      {loading && (
        <div className={cx("class-card-loading")}>
          <CircularProgress color="inherit" size={12} />
        </div>
      )}
      {selected === id && (
        <>
          <div>
            <FloatingMenuButton
              button={<IconButton mode={"ghost-2"} icon={<Settings />} />}
              menuProps={{mode: "card", content: <ClassroomSettings />}}
              anchorOrigin={{vertical: "top", horizontal: "right"}}
              transformOrigin={{vertical: "top", horizontal: "left"}}
            />
          </div>
          <ManageClassroomPU
            trigger={openClassroomModify}
            setTrigger={setOpenClassroomModify}
            title={"編輯教室"}
            action="edit"
            editClassroomId={id}
          />
          <DeleteClassroomPU
            trigger={openClassroomDelete}
            setTrigger={setOpenClassroomDelete}
            title={"刪除教室"}
            classroomId={id}
          />
        </>
      )}
    </div>
  );
};

type LectureCardProps = {
  id: string;
  name: string;
  selected: string;
  loading?: boolean;
};

const LectureCard = ({
  id = "",
  name = "新科目",
  selected = EMPTY_ID,
  loading = false,
}: LectureCardProps) => {
  const dispatch = useAppDispatch();
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);

  function clickOnCard() {
    dispatch(LecturesServices.actions.setCurrent(id));
    dispatch(
      ClassroomsServices.actions.setLastOpenedLecture({
        classroomId: classrooms.current,
        lectureId: id,
      })
    );

    const firstWidget = lectures.dict[id].widgetIds[0];
    if (firstWidget) {
      dispatch(WidgetsServices.actions.setCurrent(firstWidget));
    } else {
      dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
    }
  }
  const [openLectureModify, setOpenLectureModify] = useState(false);
  const [openLectureDelete, setOpenLectureDelete] = useState(false);
  function LectureSettings() {
    return (
      <div className={cx("settings-fm")}>
        <IconButton
          icon={<Edit />}
          text="編輯"
          mode={"ghost"}
          onClick={() => {
            setOpenLectureModify(true);
          }}
        />
        <IconButton
          icon={<TrashCan />}
          text="刪除"
          mode={"danger-ghost"}
          onClick={() => {
            setOpenLectureDelete(true);
          }}
          disabled={lectures.dict[id].type === 0}
        />
      </div>
    );
  }

  return (
    <div className={cx("lecture-card", {selected: selected === id, loading})}>
      <p
        onClick={() => {
          if (loading) return;
          clickOnCard();
        }}
        className={cx("lecture-card-words")}
      >
        <strong>{name}</strong>
      </p>
      {loading && (
        <div className={cx("lecture-card-loading")}>
          <CircularProgress color="inherit" size={12} />
        </div>
      )}
      {selected === id && (
        <>
          <div>
            <FloatingMenuButton
              button={<IconButton mode={"ghost-2"} icon={<Settings />} />}
              menuProps={{mode: "card", content: <LectureSettings />}}
              anchorOrigin={{vertical: "bottom", horizontal: "right"}}
              transformOrigin={{vertical: "bottom", horizontal: "left"}}
            />
          </div>
          <DeleteLecturePU
            trigger={openLectureDelete}
            setTrigger={setOpenLectureDelete}
            title={"刪除計畫"}
            lectureId={id}
          />
          <ManageLecturePU
            trigger={openLectureModify}
            setTrigger={setOpenLectureModify}
            title={"新增計畫"}
            action="edit"
            editLectureId={id}
          />
        </>
      )}
    </div>
  );
};

export default CourseTab;
