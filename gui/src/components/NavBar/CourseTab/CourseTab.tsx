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
import {TText} from "../../TText/TText";
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
          <p className={cx("--heading")}>
            <TText>Classroom</TText>
          </p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"Add"}
            onClick={() => {
              setOpenClassroomCreation(true);
            }}
          />
          <ManageClassroomPU
            trigger={openClassroomCreation}
            setTrigger={setOpenClassroomCreation}
            title={"Create Classroom"}
            action="create"
          />
        </div>
        <div className={cx("nav-stack")}>
          {user.classroomIds.length === 0 && (
            <div className={cx("placeholder")}>
              <TText>Please add classroom to begin lesson preparation</TText>
            </div>
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
          <p className={cx("--heading")}>
            <TText>Plan</TText>
          </p>
          <IconButton
            mode={"primary"}
            icon={<Add />}
            text={"Add"}
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
            title={"Add Plan"}
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
  name = "New Subject",
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
          text="Edit"
          mode={"ghost"}
          onClick={() => {
            setOpenClassroomModify(true);
          }}
        />
        <IconButton
          icon={<TrashCan />}
          text="Delete"
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
          <TText>Subject:</TText> {subject} <TText>| Grade:</TText>
          {grade} <TText>| Class Material:</TText>
          {publisher}
          <br /> <TText>Weekly Sessions:</TText>
          {credits} <TText>| Semester Planning:</TText>
          {plan ? <TText>Completed</TText> : <TText>Incomplete</TText>}
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
            title={"Edit Classroom"}
            action="edit"
            editClassroomId={id}
          />
          <DeleteClassroomPU
            trigger={openClassroomDelete}
            setTrigger={setOpenClassroomDelete}
            title={"Delete Classroom"}
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
  name = "New Lecture",
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
          text="Edit"
          mode={"ghost"}
          onClick={() => {
            setOpenLectureModify(true);
          }}
        />
        <IconButton
          icon={<TrashCan />}
          text="Delete"
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
            title={"Delete Plan"}
            lectureId={id}
          />
          <ManageLecturePU
            trigger={openLectureModify}
            setTrigger={setOpenLectureModify}
            title={"Add Plan"}
            action="edit"
            editLectureId={id}
          />
        </>
      )}
    </div>
  );
};

export default CourseTab;
