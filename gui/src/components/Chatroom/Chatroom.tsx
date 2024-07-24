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
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {contentIsOfType, widgetBook} from "../../schema/widget/widgetFactory";
import {ChatMessage as ChatMessageT, SENDER} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {useCompose} from "../../utils/util";
import {messageRitaService, useApiHandler} from "../../utils/service";
import {EMPTY_ID} from "../../global/constants";
import classNames from "classnames/bind";
import styles from "./Chatroom.module.scss";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {tags} from "./ChunkDefinitions";
import {MarkdownRenderer} from "./MarkdownRenderer";
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
    abortControllerRef,
    loading: waitingForReply,
    setLoading: setWaitingForReply,
    terminateResponse,
  } = useApiHandler([classroomId]);

  // ui handlers
  const [collapsed, setCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [text, setText] = useState("");
  const [ritaError, setRitaError] = useState("");

  async function sendMessage(text: string) {
    abortControllerRef.current = new AbortController();
    let newMessage = {
      text: text,
      sender: SENDER.user,
    };
    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: newMessage,
      })
    );
    setText("");
    setRitaError("");
    // Step 1: Formulate payload
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
      chatHistory: JSON.parse(JSON.stringify(chatroom.messages)),
    };

    // Step 2: Send api request and handle chunk by chunk
    try {
      setWaitingForReply(true);
      let response = await messageRitaService(
        {...payload},
        abortControllerRef?.current?.signal
      );

      const reader = response.body?.getReader();
      let result = "";

      let organizer = {
        currRitaReply: "",
        currModifyingWidgetId: "",
        currModifyingWidgetContent: "",
        currTag: "",
      };

      const decoder = new TextDecoder();
      let messageObj = {
        text: "",
        sender: SENDER.ai,
      };

      dispatch(
        ChatroomsServices.actions.addMessage({
          chatroomId: chatroom.id,
          message: messageObj,
        })
      );
      while (true) {
        const {done, value} = await reader!.read();
        if (done) break;
        let newChunk = decoder.decode(value);
        // step 3: inspect chunk and parse it accordingly
        handleChunk(newChunk, organizer);
        result += newChunk;
      }
      // step 4: modify widget if needed
      handleWidgetModification(organizer);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(error.message);
      } else {
        setRitaError("出現未知的錯誤，請再試一次");
        console.error(error);
      }
      return;
    } finally {
      setWaitingForReply(false);
    }
  }

  function handleChunk(chunk: string, organizer: any) {
    // if chunk is tags
    if (chunk.trim() in tags) {
      // tag is opened
      organizer.currTag = chunk.trim();
      return;
    } else if (tags[organizer.currTag] === chunk.trim()) {
      organizer.currTag = "";
      return;
    }
    // treat any chunk not enclosed by tags (or inbalanced tags) as message
    if (organizer.currTag === "") {
      organizer.currRitaReply += chunk;
      let messageObj = {
        text: organizer.currRitaReply,
        sender: SENDER.ai,
      };

      dispatch(
        ChatroomsServices.actions.updateLastMessage({
          chatroomId: chatroom.id,
          message: messageObj,
        })
      );
    } else if (organizer.currTag === "<wCont>") {
      organizer.currModifyingWidgetContent += chunk.trim();
    } else if (organizer.currTag === "<wid>") {
      organizer.currModifyingWidgetId += chunk.trim();
    }
  }

  const handleWidgetModification = (organizer: any) => {
    if (organizer.currModifyingWidgetContent === "") return;
    let widgetContent = JSON.parse(organizer.currModifyingWidgetContent);
    let widgetId = organizer.currModifyingWidgetId;
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
        text: `更新了${widgetBook(widgets.dict[widgets.current].type).title}`,
        sender: SENDER.system,
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
              ? widgetBook(widgets.dict[widgets.current].type).title
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
