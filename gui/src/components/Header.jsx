import React, {useState} from "react";
import IconButton from "./ui_components/IconButton";
import {Close, User, Edit, Menu} from "@carbon/icons-react";
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
const Header = ({openNav, setOpenNav = () => {}}) => {
  const [session, setSession] = useState(-1);
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
          />
        </div>
        <IconButton mode={"on-dark"} icon={<User size={20} />} />
      </div>
    </div>
  );
};

export default Header;
