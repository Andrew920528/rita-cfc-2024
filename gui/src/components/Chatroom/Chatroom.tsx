import React, {useEffect, useRef, useState} from "react";
import Textbox from "../ui_components/Textbox/Textbox";
import IconButton from "../ui_components/IconButton/IconButton";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  Stop,
} from "@carbon/icons-react";
import {useTypedSelector} from "../../store/store";
import {widgetBook} from "../../schema/widget";
import {ChatMessage as ChatMessageT, SENDER} from "../../schema/chatroom";
import {useCompose} from "../../utils/util";
import classNames from "classnames/bind";
import styles from "./Chatroom.module.scss";
import {MarkdownRenderer} from "./MarkdownRenderer";
import {useMessageRita} from "./useMessageRita";
const cx = classNames.bind(styles);
type ChatroomProps = {};
const Chatroom = ({}: ChatroomProps) => {
  // global states
  const chatroom = useTypedSelector(
    (state) => state.Chatrooms.dict[state.Chatrooms.current]
  );
  const widgets = useTypedSelector((state) => state.Widgets);
  const {sendMessage, waitingForReply, terminateResponse} = useMessageRita();

  // ui handlers
  const [collapsed, setCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [text, setText] = useState("");
  const [ritaError, setRitaError] = useState("");

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.repeat) return;
    if (event.key === "Enter") {
      if (waitingForReply) return;
      if (isComposing) return;
      if (text.trim() === "") return;
      await sendMessage(text, setText, setRitaError);
    }
  };

  const {isComposing, handleCompositionEnd, handleCompositionStart} =
    useCompose();

  if (!chatroom) return <></>;
  return (
    <div className={cx("chatroom", {collapsed: collapsed})}>
      <div className={cx("chatroom-header")}>
        <div className={cx("header-group")}>
          <p className={cx("rita")}>Rita</p>
          <p>
            {widgets.dict[widgets.current]
              ? widgetBook[widgets.dict[widgets.current].type].title
              : ""}
          </p>
        </div>
        <div className={cx("header-btn-group")}>
          <IconButton
            mode={"ghost"}
            icon={maximized ? <Minimize /> : <Maximize />}
            onClick={() => {
              if (collapsed) setCollapsed(false);
              setMaximized(!maximized);
            }}
          />
          <IconButton
            mode={"ghost"}
            icon={collapsed ? <ChevronUp /> : <ChevronDown />}
            onClick={() => {
              if (maximized) setMaximized(false);
              setCollapsed(!collapsed);
            }}
          />
        </div>
      </div>
      <div className={cx("chatroom-content", {collapsed, maximized})}>
        <ChatroomBody
          messages={chatroom.messages}
          loading={waitingForReply}
          ritaError={ritaError}
        />
        <div className={cx("chatroom-footer")}>
          <Textbox
            flex={true}
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value);
            }}
            ariaLabel="chat"
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <IconButton
            mode={"primary"}
            icon={waitingForReply ? <Stop /> : <ArrowRight />}
            onClick={async () => {
              if (waitingForReply) {
                terminateResponse();
              } else {
                await sendMessage(text, setText, setRitaError);
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
    <div className={cx("chatroom-message", sender)}>
      <div className={cx("chat-msg-decor")}></div>
      {sender === SENDER.system ? (
        <p className={cx("chatroom-message-text")}>
          {text.slice(0, 3)}
          <strong>{text.slice(3)}</strong>
        </p>
      ) : (
        <div className={cx("chatroom-message-text")}>
          <MarkdownRenderer>{text}</MarkdownRenderer>
        </div>
      )}
    </div>
  );
};

type ChatroomBodyProps = {
  messages: ChatMessageT[];
  loading: boolean;
  ritaError: string;
};
const ChatroomBody = ({messages, loading, ritaError}: ChatroomBodyProps) => {
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
    <div className={cx("chatroom-body")} ref={scrollRef}>
      {messages.map((message, index) => {
        return <ChatMessage {...message} key={index} />;
      })}
      {loading && <p className={cx("--label")}>回覆中，請稍等</p>}
      {ritaError && (
        <p className={cx("--label", "--error")}>出了點問題。請再試一次。</p>
      )}
    </div>
  );
};
