import React, {useEffect, useState} from "react";
import IconButton from "./ui_components/IconButton";
import {FloatingMenuButton} from "./ui_components/FloatingMenu";
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
import Dropdown from "./ui_components/Dropdown";
import {useAppDispatch, useTypedSelector} from "../store/store";

import ManageAccountPU from "./PopUps/ManageAccountPU";
import ManageClassroomPU from "./PopUps/ManageClassroomPU";
import CreateLecturePU from "./PopUps/CreateLecturePU";
import {LecturesServices} from "../features/LectureSlice";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {WidgetsServices} from "../features/WidgetsSlice";
import {UserServices} from "../features/UserSlice";
import {useDeleteLecture} from "../store/globalActions";
import {API_ERROR, EMPTY_ID} from "../utils/constants";
import {deleteLectureService, useApiHandler} from "../utils/service";

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
        deleteLectureService(s, {
          lectureId: lectureId,
          classroomId: classrooms.current,
        }),
    });
    if (r.status === API_ERROR) {
      return;
    }
    deleteLectureState({lectureId: lectureId, classroomId: classrooms.current});
  }
  // ui controllers
  const [openLectureCreation, setopenLectureCreation] = useState(false);
  return (
    <div className="header">
      <div className="header-left">
        <IconButton
          mode={"on-dark"}
          icon={openNav ? <Close size={20} /> : <Menu size={20} />}
          onClick={() => {
            setOpenNav(!openNav);
          }}
        />
        <div className="title">
          <p className="title-rita">Rita</p>
          <p className="title-beta">
            <sup>beta</sup>
          </p>
        </div>
      </div>
      <div className="header-right">
        {classrooms.current === EMPTY_ID ||
        Object.keys(classrooms.dict).length === 0 ? (
          <div className="no-subject-hint">
            <i>新增教室以開始備課</i>
          </div>
        ) : (
          <div className="subject-banner">
            <p className="subject --heading">
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
              idDict={classrooms.dict[classrooms.current].lectures.reduce(
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
            />
            <CreateLecturePU
              title={"新增課程"}
              trigger={openLectureCreation}
              setTrigger={setopenLectureCreation}
            />
          </div>
        )}

        <div className="header-right-end">
          <SaveGroup />
          <AccountButton />
        </div>
      </div>
    </div>
  );
};

const SaveGroup = () => {
  const dispatch = useAppDispatch();
  const unsavedWidgets = useTypedSelector((state) => state.Widgets.unsaved);
  const scheduleChanged = useTypedSelector(
    (state) => state.User.scheduleChanged
  );
  const saveAll = () => {
    if (scheduleChanged) {
      dispatch(UserServices.actions.saveSchedule());
    }
    dispatch(WidgetsServices.actions.saveAll());
  };
  return (
    <div className="save-group">
      <i className={Object.keys(unsavedWidgets).length === 0 ? "saved" : ""}>
        {Object.keys(unsavedWidgets).length === 0 && !scheduleChanged
          ? "All changes saved"
          : "New changes unsaved"}
      </i>
      <IconButton
        mode={"on-dark"}
        icon={<Save size={20} />}
        onClick={() => {
          saveAll();
        }}
        disabled={Object.keys(unsavedWidgets).length === 0 && !scheduleChanged}
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
    return (
      <div className="account-content">
        <div className="user-info">
          <div className="user-info-col">
            <p>
              <strong>{name}</strong>
            </p>
            <p className="user-detail">
              {occupation} @ {school}
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
            // TODO: logout
            console.log("Log out");
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
