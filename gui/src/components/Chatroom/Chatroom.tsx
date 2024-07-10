import React, {useEffect, useRef, useState} from "react";
import Textbox from "../ui_components/Textbox/Textbox";
import IconButton from "../ui_components/IconButton/IconButton";
import {ArrowRight, ChevronDown, ChevronUp, Stop} from "@carbon/icons-react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {contentIsOfType, widgetBook} from "../../schema/widget";
import {ChatMessage as ChatMessageT} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {mimicApi} from "../../utils/util";
import {messageRitaService, useApiHandler} from "../../utils/service";
import {debug, error} from "console";
import {EMPTY_ID, API} from "../../global/constants";
import classNames from "classnames/bind";
import styles from "./Chatroom.module.scss";
import {WidgetsServices} from "../../features/WidgetsSlice";

const cx = classNames.bind(styles);
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
  const [ritaError, setRitaError] = useState("");
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
    setRitaError("");

    let payload = {
      prompt: text,
      widget:
        widgets.current === EMPTY_ID
          ? {
              id: EMPTY_ID,
              type: -1,
              content: "{}",
            }
          : {
              id: widgets.current,
              type: widgets.dict[widgets.current].type,
              content: JSON.parse(
                JSON.stringify(widgets.dict[widgets.current])
              ),
            },
      lectureId: lecture.id,
      classroomId: classroomId,
    };

    let r = await apiHandler({
      apiFunction: (s) =>
        messageRitaService(
          {
            ...payload,
          },
          s
        ),
      debug: true,
      identifier: "messageRita",
    });

    let status = r.status;
    if (status === API.ERROR) {
      setRitaError(r.data);
      return;
    } else if (r.status === API.ABORTED) {
      return;
    }
    handleReply(r.data);
  }

  const handleReply = (data: any) => {
    let reply = data.reply;
    let widgetContent = data.content;
    let widgetId = data.widgetId;
    let messageObj = {
      text: reply,
      sender: "Rita",
    };

    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: messageObj,
      })
    );

    if (widgetId === widgets.current && widgetId !== EMPTY_ID) {
      if (!contentIsOfType(widgets.dict[widgets.current].type, widgetContent)) {
        return;
      }
      dispatch(
        WidgetsServices.actions.updateWidget({
          newWidget: {
            id: widgetId,
            type: widgets.dict[widgets.current].type,
            content: widgetContent,
          },
        })
      );

      let messageObj = {
        text: `更新了 ${widgetBook[widgets.dict[widgets.current].type].title}`,
        sender: "Rita",
      };

      dispatch(
        ChatroomsServices.actions.addMessage({
          chatroomId: chatroom.id,
          message: messageObj,
        })
      );
    }
  };

  useEffect(() => {
    setRitaError("");
    setText("");
  }, [widgets.current]);

  // useEffect(() => {

  //   // Add event listener for keydown
  //   window.addEventListener("keydown", handleKeyDown);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [waitingForReply, sendMessage, text]);
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.repeat) return;
    if (event.key === "Enter") {
      if (waitingForReply) return;
      if (isComposing) return;
      if (text.trim() === "") return;
      await sendMessage(text);
    }
  };

  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

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
        <IconButton
          mode={"ghost"}
          icon={collapsed ? <ChevronUp /> : <ChevronDown />}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        />
      </div>
      <div className={cx("chatroom-content", {collapsed: collapsed})}>
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
    <div className={cx("chatroom-message", sender)}>
      <div className={cx("chat-msg-decor")}></div>
      <p className={cx("chatroom-message-text")}>{text}</p>
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
