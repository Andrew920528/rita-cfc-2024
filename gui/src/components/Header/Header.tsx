import React, {useEffect, useState} from "react";
import IconButton from "../ui_components/IconButton/IconButton";
import {FloatingMenuButton} from "../ui_components/FloatingMenu/FloatingMenu";
import {
  Close,
  User,
  Edit,
  Add,
  Settings,
  Logout,
  Menu,
  UserAvatar,
  Save,
} from "@carbon/icons-react";
import Dropdown from "../ui_components/Dropdown/Dropdown";
import {useAppDispatch, useTypedSelector} from "../../store/store";

import ManageAccountPU from "../PopUps/ManageAccountPU/ManageAccountPU";
import ManageClassroomPU from "../PopUps/ManageClassroomPU/ManageClassroomPU";
import CreateLecturePU from "../PopUps/CreateLecturePU/CreateLecturePU";
import {LecturesServices} from "../../features/LectureSlice";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {UserServices} from "../../features/UserSlice";
import {useDeleteLecture} from "../../global/globalActions";
import {API, EMPTY_ID} from "../../global/constants";
import {
  deleteLectureService,
  updateClassroomService,
  updateUserService,
  updateWidgetBulkService,
  useApiHandler,
} from "../../utils/service";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import {LoginStatusServices} from "../../features/LoginStatusSlice";

const cx = classNames.bind(styles);
type HeaderProps = {
  openNav: boolean;
  setOpenNav: (set: boolean) => void;
};
const Header = ({openNav, setOpenNav = () => {}}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  const [openSubjectEdit, setOpenSubjectEdit] = useState(false);
  const deleteLectureState = useDeleteLecture();
  const {apiHandler, loading, terminateResponse} = useApiHandler();
  async function deleteLecture(lectureId: string) {
    let r = await apiHandler({
      apiFunction: (s) =>
        deleteLectureService(
          {
            lectureId: lectureId,
            classroomId: classrooms.current,
          },
          s
        ),
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      return;
    }
    deleteLectureState({lectureId: lectureId, classroomId: classrooms.current});
  }
  // ui controllers
  const [openLectureCreation, setopenLectureCreation] = useState(false);
  return (
    <div className={cx("header")}>
      <div className={cx("header-left")}>
        <IconButton
          mode={"on-dark"}
          icon={openNav ? <Close size={20} /> : <Menu size={20} />}
          onClick={() => {
            setOpenNav(!openNav);
          }}
        />
        <div className={cx("title")}>
          <p className={cx("title-rita")}>Rita</p>
          <p className={cx("title-beta")}>
            <sup>beta</sup>
          </p>
        </div>
      </div>
      <div className={cx("header-right")}>
        {classrooms.current === EMPTY_ID ||
        Object.keys(classrooms.dict).length === 0 ? (
          <div className={cx("no-subject-hint")}>
            <i>新增教室以開始備課</i>
          </div>
        ) : (
          <div className={cx("subject-banner")}>
            <p className={cx("subject", "--heading")}>
              {classrooms.dict[classrooms.current].name}
            </p>
            <IconButton
              mode={"on-dark"}
              icon={<Edit size={20} />}
              onClick={() => {
                setOpenSubjectEdit(true);
              }}
            />
            <ManageClassroomPU
              trigger={openSubjectEdit}
              setTrigger={setOpenSubjectEdit}
              title={"編輯教室"}
              action="edit"
              editClassroomId={classrooms.current}
            />
            <Dropdown
              currId={lectures.current}
              setCurrId={(id: string) => {
                dispatch(LecturesServices.actions.setCurrent(id));
                dispatch(
                  ClassroomsServices.actions.setLastOpenedLecture({
                    classroomId: classrooms.current,
                    lectureId: id,
                  })
                );
              }}
              idDict={classrooms.dict[classrooms.current].lectureIds.reduce(
                (dict, lectureId: string) => {
                  dict[lectureId] = "";
                  return dict;
                },
                {} as {[key: string]: string}
              )}
              getName={(id) => {
                return lectures.dict[id].name;
              }}
              placeholder="新增課程以開始備課"
              flex={false}
              action={(id: string) => lectures.dict[id].type === 1}
              actionFunction={(id: string) => {
                deleteLecture(id);
              }}
              extra={
                <IconButton
                  flex={true}
                  mode={"primary"}
                  text={"新增課程"}
                  icon={<Add />}
                  onClick={() => {
                    setopenLectureCreation(true);
                  }}
                />
              }
              actionDisabled={() => loading}
            />
            <CreateLecturePU
              title={"新增課程"}
              trigger={openLectureCreation}
              setTrigger={setopenLectureCreation}
            />
          </div>
        )}

        <div className={cx("header-right-end")}>
          <SaveGroup />
          <AccountButton />
        </div>
      </div>
    </div>
  );
};

const SaveGroup = () => {
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const unsavedWidgets = useTypedSelector((state) => state.Widgets.unsaved);
  const scheduleChanged = useTypedSelector(
    (state) => state.User.scheduleChanged
  );
  const widgetDict = useTypedSelector((state) => state.Widgets.dict);
  const {apiHandler, loading} = useApiHandler();
  const saveAll = async () => {
    let r;
    if (scheduleChanged) {
      // update user here
      r = await apiHandler({
        apiFunction: (s) =>
          updateUserService(
            {
              schedule: JSON.stringify(user.schedule),
            },
            s
          ),
        debug: true,
        identifier: "updateUserService",
      });
      if (r.status === API.ERROR || r.status === API.ABORTED) {
        // TODO Failed to save toast
        return;
      }
      dispatch(UserServices.actions.saveSchedule());
    }
    // save all widgets here
    if (Object.keys(unsavedWidgets).length !== 0) {
      r = await apiHandler({
        apiFunction: (s) =>
          updateWidgetBulkService(
            {
              widgetIds: Object.keys(unsavedWidgets),
              contents: Object.keys(unsavedWidgets).map((w: string) => {
                let content = widgetDict[w].content;
                return JSON.stringify(content);
              }),
            },
            s
          ),
        debug: true,
        identifier: "updateWidgetBulkService",
      });
      if (r.status === API.ERROR || r.status === API.ABORTED) {
        // TODO Failed to save toast
        return;
      }
      dispatch(WidgetsServices.actions.saveAll());
    }
  };
  return (
    <div className={cx("save-group")}>
      <i
        className={cx({
          saved: Object.keys(unsavedWidgets).length === 0 && !scheduleChanged,
        })}
      >
        {Object.keys(unsavedWidgets).length === 0 && !scheduleChanged
          ? "All changes saved"
          : loading
          ? "Saving..."
          : "New changes unsaved"}
      </i>
      <IconButton
        mode={"on-dark"}
        icon={<Save size={20} />}
        onClick={async () => {
          await saveAll();
        }}
        disabled={
          (Object.keys(unsavedWidgets).length === 0 && !scheduleChanged) ||
          loading
        }
      />
    </div>
  );
};

const AccountButton = () => {
  const user = useTypedSelector((state) => state.User);
  const AccountContent = ({
    name = "廖偉良",
    occupation = "級任老師",
    school = "松山高中",
  }) => {
    const [openManageAccountPU, setOpenManageAccountPU] = useState(false);
    const dispatch = useAppDispatch();

    return (
      <div className={cx("account-content")}>
        <div className={cx("user-info")}>
          <div className={cx("user-info-col")}>
            <p>
              <strong>{name}</strong>
            </p>
            <p className={cx("user-detail")}>
              {occupation} {occupation !== "" && school !== "" && "@"} {school}
            </p>
          </div>
          <UserAvatar size={30} />
        </div>
        <IconButton
          flex={true}
          text={"管理帳號"}
          icon={<Settings />}
          mode={"on-dark-2"}
          onClick={() => {
            setOpenManageAccountPU(!openManageAccountPU);
          }}
        />

        <ManageAccountPU
          trigger={openManageAccountPU}
          setTrigger={setOpenManageAccountPU}
          title="管理帳號"
        />

        <IconButton
          flex={true}
          text={"登出"}
          icon={<Logout />}
          mode={"on-dark-2"}
          onClick={() => {
            sessionStorage.removeItem("sessionId");
            dispatch(LoginStatusServices.actions.setComplete(false));
          }}
        />
      </div>
    );
  };

  const menuProps = {
    mode: "dark",
    content: (
      <AccountContent
        name={user.alias}
        occupation={user.occupation}
        school={user.school}
      />
    ),
  };
  return (
    <FloatingMenuButton
      button={<IconButton mode="on-dark" icon={<User size={20} />} />}
      menuProps={menuProps}
      anchorOrigin={{horizontal: "right", vertical: "bottom"}}
      transformOrigin={{horizontal: "right", vertical: "top"}}
    />
  );
};

export default Header;
