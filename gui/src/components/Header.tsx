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

type HeaderProps = {
  openNav: boolean;
  setOpenNav: (set: boolean) => void;
};
const Header = ({openNav, setOpenNav = () => {}}: HeaderProps) => {
  const [session, setSession] = useState<number | string>(-1);
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
        <div className="subject-banner">
          <p className="subject --heading">新科目</p>
          <IconButton mode={"on-dark"} icon={<Edit size={20} />} />
          <Dropdown
            currId={session}
            setCurrId={setSession}
            idDict={dummy}
            getName={(id) => {
              return dummy[id as keyof DropdownDict].text;
            }}
            placeholder="none selected"
            flex={false}
            extra={
              <IconButton
                flex={true}
                mode={"primary"}
                text={"新增課程"}
                icon={<Add />}
              />
            }
          />
        </div>
        <AccountButton />
      </div>
    </div>
  );
};

type DropdownDict = {
  [key: number]: any;
};
const dummy: DropdownDict = {
  0: {
    id: "option-0",
    text: "Lorem, ipsum dolorawjenfla neawnflajwenfawjenfajwenfkawnefkajnw sit amet consectetur adipisicing elit.",
  },
  1: {
    id: "option-1",
    text: "Option 1",
  },
  2: {
    id: "option-2",
    text: "Option 2",
  },
  3: {
    id: "option-3",
    text: "Option 3 - a disabled item",
    disabled: true,
  },
  4: {
    id: "option-4",
    text: "Option 4",
  },
  5: {
    id: "option-5",
    text: "Option 5",
  },
};

const AccountButton = () => {
  const AccountContent = ({
    name = "廖偉良",
    occupation = "級任老師",
    school = "松山高中",
  }) => {
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
            console.log("Manage Account");
          }}
        />
        <IconButton
          flex={true}
          text={"登出"}
          icon={<Logout />}
          mode={"on-dark-2"}
          onClick={() => {
            console.log("Log out");
          }}
        />
      </div>
    );
  };

  const menuProps = {
    mode: "dark",
    content: <AccountContent />,
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
