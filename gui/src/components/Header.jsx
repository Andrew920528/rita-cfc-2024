import React from "react";
import IconButton from "./IconButton";
import {Close, User, Edit} from "@carbon/icons-react";
import {Dropdown} from "@carbon/react";

const items = [
  {
    id: "option-0",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: "option-1",
    text: "Option 1",
  },
  {
    id: "option-2",
    text: "Option 2",
  },
  {
    id: "option-3",
    text: "Option 3 - a disabled item",
    disabled: true,
  },
  {
    id: "option-4",
    text: "Option 4",
  },
  {
    id: "option-5",
    text: "Option 5",
  },
];
const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <IconButton mode={"on-dark"} icon={<Close size={20} />} />
        <div className="title">
          <p className="title-rita">Rita</p>
          <p className="title-beta">
            <sup>beta</sup>
          </p>
        </div>
      </div>
      <div className="header-right">
        <div className="subject-banner">
          <p className="--heading">新科目</p>
          <IconButton mode={"on-dark"} icon={<Edit size={20} />} />
        </div>
        <IconButton mode={"on-dark"} icon={<User size={20} />} />
      </div>
    </div>
  );
};

export default Header;
