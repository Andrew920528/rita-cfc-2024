import React, {useState} from "react";
import Textbox from "./ui_components/Textbox";
import IconButton from "./ui_components/IconButton";
import {ArrowRight, ChevronDown, ChevronUp} from "@carbon/icons-react";

const ChatroomBody = () => {
  return <div className="chatroom-body">Chatroom-body</div>;
};

type ChatroomProps = {
  context?: string;
};
const Chatroom = ({context}: ChatroomProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`chatroom ${collapsed ? "collapsed" : "opened"}`}>
      <div className="chatroom-header">
        <div className="header-group">
          <p className="rita">Rita</p>
          <p>{context}</p>
        </div>
        <IconButton
          mode={"ghost"}
          icon={collapsed ? <ChevronUp /> : <ChevronDown />}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        />
      </div>
      <div className={`chatroom-content ${collapsed ? "collapsed" : "opened"}`}>
        <ChatroomBody />
        <div className="chatroom-footer">
          <Textbox flex={true} />
          <IconButton mode={"primary"} icon={<ArrowRight />} />
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
