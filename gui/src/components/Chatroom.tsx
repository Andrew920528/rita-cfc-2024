import React, {useEffect, useRef, useState} from "react";
import Textbox from "./ui_components/Textbox";
import IconButton from "./ui_components/IconButton/IconButton";
import {ArrowRight, ChevronDown, ChevronUp, Stop} from "@carbon/icons-react";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {widgetBook} from "../schema/widget";
import {ChatMessage as ChatMessageT} from "../schema/chatroom";
import {ChatroomsServices} from "../features/ChatroomsSlice";
import {mimicApi} from "../utils/util";
import {messageRitaService, useApiHandler} from "../utils/service";
import {debug} from "console";
import {EMPTY_ID, API_ERROR} from "../utils/constants";

type ChatroomProps = {};
const Chatroom = ({}: ChatroomProps) => {
  // global states
  const dispatch = useAppDispatch();
  const chatroom = useTypedSelector(
    (state) => state.Chatrooms.dict[state.Chatrooms.current]
  );

  const classroomId = useTypedSelector((state) => state.Classrooms.current);
  const lecture = useTypedSelector(
    (state) => state.Lectures.dict[state.Lectures.current]
  );
  const widgets = useTypedSelector((state) => state.Widgets);
  // api handlers
  const {
    apiHandler,
    loading: waitingForReply,
    terminateResponse,
  } = useApiHandler([classroomId]);

  // ui handlers
  const [collapsed, setCollapsed] = useState(false);
  // const [readyToSend, setReadyToSend] = useState(true);
  const [text, setText] = useState("");
  async function sendMessage(text: string) {
    let newMessage = {
      text: text,
      sender: "User",
    };
    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: newMessage,
      })
    );
    setText("");
    let r = await apiHandler({
      apiFunction: (c: AbortSignal) =>
        messageRitaService(c, {
          prompt: text,
          widget:
            widgets.current === EMPTY_ID
              ? undefined
              : {
                  id: widgets.current,
                  type: widgets.dict[widgets.current].type,
                  content: JSON.stringify(widgets.dict[widgets.current]),
                },
          lectureId: lecture.id,
          classroomId: classroomId,
        }),
      debug: true,
      identifier: "messageRita",
    });

    let status = r.status;
    let responseMessage = r.data;

    if (status === API_ERROR) return;
    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: responseMessage,
      })
    );
  }

  if (!chatroom) return <></>;
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
        <ChatroomBody messages={chatroom.messages} loading={waitingForReply} />
        <div className="chatroom-footer">
          <Textbox
            flex={true}
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value);
            }}
            ariaLabel="chat"
          />
          <IconButton
            mode={"primary"}
            icon={waitingForReply ? <Stop /> : <ArrowRight />}
            onClick={async () => {
              if (waitingForReply) {
                terminateResponse();
              } else {
                await sendMessage(text);
              }
            }}
            disabled={text.trim() === "" && !waitingForReply}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chatroom);

const ChatMessage = ({text, sender}: ChatMessageT) => {
  return (
    <div className={`chatroom-message ${sender}`}>
      <div className="chat-msg-decor"></div>
      <p className="chatroom-message-text">{text}</p>
    </div>
  );
};

type ChatroomBodyProps = {
  messages: ChatMessageT[];
  loading: boolean;
};
const ChatroomBody = ({messages, loading}: ChatroomBodyProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, loading]);
  return (
    <div className="chatroom-body" ref={scrollRef}>
      {messages.map((message, index) => {
        return <ChatMessage {...message} key={index} />;
      })}
      {loading && <p className="--label">Waiting for response</p>}
    </div>
  );
};
