import React, {useState} from "react";
import Textbox from "./ui_components/Textbox";
import IconButton from "./ui_components/IconButton";
import {ArrowRight, ChevronDown, ChevronUp} from "@carbon/icons-react";
import {useTypedSelector} from "../store/store";
import {widgetBook} from "../schema/widget";
import {ChatMessage as ChatMessageT} from "../schema/chatroom";

const ChatMessage = ({text, sender}: ChatMessageT) => {
  return (
    <div className="chatroom-message">
      <p className="chatroom-message-text">{text}</p>
      <p className="chatroom-message-sender">{sender}</p>
    </div>
  );
};

type ChatroomBodyProps = {
  messages: ChatMessageT[];
};
const ChatroomBody = ({messages}: ChatroomBodyProps) => {
  const [previousSender, setPreviousSender] = useState<string>("");
  return (
    <div className="chatroom-body">
      {messages.map((message, index) => {
        if (message.sender === previousSender) {
          console.error("Sender cannot send more than 1 message at a time.");
          return;
        }
        return <ChatMessage {...message} key={index} />;
      })}
    </div>
  );
};

type ChatroomProps = {};
const Chatroom = ({}: ChatroomProps) => {
  // ui handlers
  const [collapsed, setCollapsed] = useState(false);

  // global states
  // NOTE: API is going to take ids and internally parse the actual data
  const classroomId = useTypedSelector((state) => state.Classrooms.current);
  const lectureId = useTypedSelector((state) => state.Lectures.current);
  // NOTE: chatroom.current is set by other ui components and reflected here
  const chatroom = useTypedSelector(
    (state) => state.Chatrooms.dict[state.Chatrooms.current]
  );
  // NOTE: Since widgets might not be updated instantly, we
  // need to get its data at the frontend
  const accessibleWidgets = useTypedSelector(
    (state) => state.Lectures.dict[lectureId].widgets
  );
  const widgets = useTypedSelector((state) => state.Widgets);
  const dummyChatMessages: ChatMessageT[] = [
    {text: "Hi", sender: "Rita"},
    {text: "Hi", sender: "User"},
    {text: "Hi", sender: "Rita"},
    {text: "Hi", sender: "User"},
  ];
  return (
    <div className={`chatroom ${collapsed ? "collapsed" : "opened"}`}>
      <div className="chatroom-header">
        <div className="header-group">
          <p className="rita">Rita</p>
          <p>
            {widgets.dict[widgets.current]
              ? widgetBook[widgets.dict[widgets.current].type].title
              : ""}
          </p>
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
        <ChatroomBody messages={dummyChatMessages} />
        <div className="chatroom-footer">
          <Textbox flex={true} />
          <IconButton mode={"primary"} icon={<ArrowRight />} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chatroom);
