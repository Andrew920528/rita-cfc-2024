import React, {useState} from "react";
import IconButton from "./ui_components/IconButton";
import FloatingMenu from "./ui_components/FloatingMenu";
import {
  Close,
  User,
  Edit,
  Add,
  Settings,
  Logout,
  Menu,
} from "@carbon/icons-react";
import Dropdown from "./ui_components/Dropdown";

const dummy = {
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

const AccountMenu = () => {
  const AccountContent = ({
    name = "廖偉良",
    occupation = "級任老師",
    school = "松山高中",
  }) => {
    return (
      <div className="account-content">
        <div className="user-info">
          <p> {name} </p>
          <p>
            {" "}
            {occupation} @ {school}
          </p>
        </div>
        <IconButton
          flex={true}
          text={"管理帳號"}
          icon={<Settings />}
          mode={"ghost"}
          onClick={() => {
            console.log("Manage Account");
          }}
        />
        <IconButton
          flex={true}
          text={"登出"}
          icon={<Logout />}
          mode={"ghost"}
          onClick={() => {
            console.log("Log out");
          }}
        />
      </div>
    );
  };
  return <FloatingMenu content={<AccountContent />} />;
};

const Header = ({openNav, setOpenNav = () => {}}) => {
  const [session, setSession] = useState(-1);
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  return (
    <div className="header">
      <div className="header-left">
        <IconButton
          mode={"on-dark"}
          icon={openNav ? <Close size={20} /> : <Menu size={20} />}
          onClick={() => {
            setOpenNav(!openNav);
            console.log("fefe");
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
              return dummy[id].text;
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
        <div className="account-button">
          <IconButton
            mode={"on-dark"}
            icon={<User size={20} />}
            onClick={() => {
              setOpenAccountMenu(!openAccountMenu);
            }}
          />
          {openAccountMenu && <AccountMenu />}
        </div>
      </div>
    </div>
  );
};

export default Header;
