import React, {useEffect, useRef, useState} from "react";
import Textbox from "./ui_components/Textbox";
import IconButton from "./ui_components/IconButton";
import {ArrowRight, ChevronDown, ChevronUp, Stop} from "@carbon/icons-react";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {widgetBook} from "../schema/widget";
import {ChatMessage as ChatMessageT} from "../schema/chatroom";
import {ChatroomsServices} from "../features/ChatroomsSlice";
import {mimicApi} from "../utils/util";

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
  // ui handlers
  const [collapsed, setCollapsed] = useState(false);
  const [readyToSend, setReadyToSend] = useState(true);
  const [text, setText] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    // Clean up the controller when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [classroomId]);
  async function sendMessage(text: string) {
    setReadyToSend(false);
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

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    try {
      await mimicApi(2000, signal);
      // send api request with text.trim()
      const response = {
        text: "Hello, I'm Rita",
        sender: "Rita",
      };
      dispatch(
        ChatroomsServices.actions.addMessage({
          chatroomId: chatroom.id,
          message: response,
        })
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // console.log("Fetch aborted");
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("unknow error occured");
      }
    } finally {
      setReadyToSend(true);
    }
  }

  function terminateResponse() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setReadyToSend(true);
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
        <ChatroomBody messages={chatroom.messages} loading={!readyToSend} />
        <div className="chatroom-footer">
          <Textbox
            flex={true}
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value);
            }}
          />
          <IconButton
            mode={"primary"}
            icon={readyToSend ? <ArrowRight /> : <Stop />}
            onClick={() => {
              if (readyToSend) {
                sendMessage(text);
              } else {
                terminateResponse();
              }
            }}
            disabled={text === "" && readyToSend}
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
