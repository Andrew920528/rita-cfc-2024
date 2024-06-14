import React, {useState} from "react";
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
} from "@carbon/icons-react";
import Dropdown from "./ui_components/Dropdown";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {UserServices} from "../features/UserSlice";
import PopUp from "./PopUps/PopUp";
import ManageAccountPU from "./PopUps/ManageAccountPU";
import ManageClassroomPU from "./PopUps/ManageClassroomPU";

type HeaderProps = {
  openNav: boolean;
  setOpenNav: (set: boolean) => void;
};
const Header = ({openNav, setOpenNav = () => {}}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const sessions = useTypedSelector((state) => state.Sessions);
  const [openSubjectEdit, setOpenSubjectEdit] = useState(false);
  // ui controllers
  const [session, setSession] = useState<string>("-1");
  const [openSessionCreation, setopenSessionCreation] = useState(false);
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
        {classrooms.current === "NONE" ||
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
              currId={session}
              setCurrId={setSession}
              idDict={classrooms.dict[classrooms.current].sessions.reduce(
                (dict, sessionId: string) => {
                  dict[sessionId] = "";
                  return dict;
                },
                {} as {[key: string]: string}
              )}
              getName={(id) => {
                return sessions.dict[id].name;
              }}
              placeholder="新增課程以開始備課"
              flex={false}
              action={true}
              extra={
                <IconButton
                  flex={true}
                  mode={"primary"}
                  text={"新增課程"}
                  icon={<Add />}
                  onClick={() => {
                    setopenSessionCreation(true);
                  }}
                />
              }
            />
          </div>
        )}
        <AccountButton />
      </div>
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
