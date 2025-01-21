import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Textbox from "../ui_components/Textbox/Textbox";
import IconButton from "../ui_components/IconButton/IconButton";
import {
  ArrowRight,
  Catalog,
  ChevronDown,
  ChevronUp,
  Help,
  Idea,
  Maximize,
  Minimize,
  ResultDraft,
  Stop,
  VideoPlayer,
} from "@carbon/icons-react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {
  contentIsOfType,
  widgetBook,
  widgetPromptRec,
} from "../../schema/widget/widgetFactory";
import {ChatMessage as ChatMessageT, SENDER} from "../../schema/chatroom";
import {useCompose} from "../../utils/util";
import classNames from "classnames/bind";
import styles from "./Chatroom.module.scss";
import {MarkdownRenderer} from "./MarkdownRenderer";
import {useMessageRita} from "./useMessageRita";
import {CircularProgress} from "@mui/material";
import {translateService, useApiHandler} from "../../utils/service";
import {AGENCY, API, EMPTY_ID} from "../../global/constants";
import Chip from "../ui_components/Chip/Chip";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {WidgetType} from "../../schema/widget/widget";
import {IdeatingDots} from "../ui_components/IdeatingDots/IdeatingDots";
import {TText} from "../TText/TText";
import useLang from "../../lang/useLang";
const cx = classNames.bind(styles);

type ChatroomProps = {
  absolutePositioned?: boolean;
  chatroomId: string;
};
const Chatroom = ({
  chatroomId,
  absolutePositioned: absolutePositioned = true,
}: ChatroomProps) => {
  // global states
  const chatroom = useTypedSelector(
    (state) => state.Chatrooms.dict[chatroomId]
  );
  const widgets = useTypedSelector((state) => state.Widgets);
  const {
    sendMessage,
    constructingWidget,
    terminateResponse,
    ritaError,
    setConstructingWidget,
  } = useMessageRita(chatroomId);
  const waitingForReply = useTypedSelector(
    (state) => state.Chatrooms.waitingForReply[chatroomId]
  );

  // ui handlers
  const [collapsed, setCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [text, setText] = useState("");
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.repeat) return;
    if (event.key === "Enter") {
      if (waitingForReply) return;
      if (isComposing) return;
      if (text.trim() === "") return;
      setText("");
      await sendMessage(text);
    }
  };

  const {isComposing, handleCompositionEnd, handleCompositionStart} =
    useCompose();

  if (!chatroom) return <></>;
  return (
    <div
      className={cx("chatroom", {
        "absolute-position": absolutePositioned,
        collapsed: absolutePositioned && collapsed,
        maximized: absolutePositioned && maximized,
      })}
    >
      <div className={cx("chatroom-header")}>
        <div className={cx("header-group")}>
          <p className={cx("rita")}>Rita</p>
          {chatroom.agency !== AGENCY.LECTURE && (
            <p>
              {widgets.dict[widgets.current] ? (
                <TText>
                  {widgetBook(widgets.dict[widgets.current].type).title}
                </TText>
              ) : (
                ""
              )}
            </p>
          )}
        </div>
        {absolutePositioned && (
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
        )}
      </div>
      <div
        className={cx("chatroom-content", {
          "absolute-position": absolutePositioned,
          collapsed: absolutePositioned && collapsed,
          maximized: absolutePositioned && maximized,
        })}
      >
        <ChatroomBody
          messages={chatroom.messages}
          constructingWidget={constructingWidget}
          loading={waitingForReply}
          ritaError={ritaError}
          sendMessage={sendMessage}
          setText={setText}
          agency={chatroom.agency}
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
                setConstructingWidget(false);
                terminateResponse();
              } else {
                setText("");
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

const ChatMessage = ({text, sender, completed}: ChatMessageT) => {
  const [translated, setTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const {apiHandler, loading, terminateResponse} = useApiHandler();
  async function translate() {
    setTranslated(!translated);
    if (loading) {
      terminateResponse();
      return;
    }
    if (translatedText !== "") return;

    let r = await apiHandler({
      apiFunction: (s) => translateService({text}, s),
      debug: true,
      identifier: "translate",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      return;
    }
    setTranslatedText(r.data);
  }
  const l = useLang();

  return (
    <div className={cx("chatroom-message", sender)}>
      {sender === SENDER.system ? (
        <p className={cx("chatroom-message-text")}>
          <TText>{text.slice(0, 8)}</TText>
          <strong>
            <TText>{text.slice(8)}</TText>
          </strong>
        </p>
      ) : sender === SENDER.ai ? (
        <>
          <div className={cx("chat-msg-decor")} />
          <div className={cx("chatroom-message-text")}>
            <MarkdownRenderer>
              {translated ? (loading ? text : translatedText) : text}
            </MarkdownRenderer>
            <p
              className={cx("--label", "jelly")}
              onClick={() => {
                translate();
              }}
            >
              {completed && (
                <TText>
                  {translated
                    ? loading
                      ? "Translating(Cancel)"
                      : "Show Original Text"
                    : "Translation Jelly"}
                </TText>
              )}
            </p>
          </div>
        </>
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
  constructingWidget: boolean;
  ritaError: string;
  setText: (text: string) => void;
  sendMessage: any;
  agency: AGENCY;
};
const ChatroomBody = ({
  messages,
  loading,
  constructingWidget,
  ritaError,
  sendMessage,
  agency,
}: ChatroomBodyProps) => {
  const widgets = useTypedSelector((state) => state.Widgets);
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
      {messages.length === 0 && (
        <div className={cx("empty-chatroom-placeholder")}>
          <TText>Hello, How can I assist you?</TText>
          <div className={cx("chips")}>
            {agency === AGENCY.LECTURE ? (
              lecturePromptRecs.map((promptObj) => (
                <Chip
                  text={promptObj.chipMessage}
                  icon={promptObj.icon}
                  iconColor={promptObj.iconColor}
                  onClick={async () => {
                    await sendMessage(promptObj.actualPrompt);
                  }}
                  key={promptObj.chipMessage}
                />
              ))
            ) : widgets.dict[widgets.current] ? (
              widgetPromptRec(widgets.dict[widgets.current].type).map(
                (promptObj) => (
                  <Chip
                    text={promptObj.chipMessage}
                    icon={promptObj.icon}
                    iconColor={promptObj.iconColor}
                    onClick={async () => {
                      await sendMessage(promptObj.actualPrompt);
                    }}
                    key={promptObj.chipMessage}
                  />
                )
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
      {messages.map((message, index) => {
        return <ChatMessage {...message} key={index} />;
      })}
      <LoadingMessage
        text={"Replying, please wait"}
        loadingCondition={loading && !constructingWidget}
        showCircularProgress={false}
        showDots={true}
      />
      <LoadingMessage
        text={"Editing Tool Content"}
        loadingCondition={loading && constructingWidget}
        showCircularProgress={true}
      />
      {ritaError && (
        <p className={cx("--label", "--error")}>
          <TText>Something went wrong. Please try again.</TText>
        </p>
      )}
    </div>
  );
};

const LoadingMessage = (args: {
  text: string;
  loadingCondition: boolean;
  className?: string;
  showCircularProgress?: boolean;
  showDots?: boolean;
}) => {
  if (!args.loadingCondition) return null;
  return (
    <div className={cx("loading-message", args.className)}>
      {args.showCircularProgress && (
        <CircularProgress color="inherit" size={12} />
      )}
      <p className={cx("--label")}>
        <TText>{args.text}</TText>
      </p>
      {args.showDots && <IdeatingDots />}
    </div>
  );
};

const lecturePromptRecs = [
  {
    chipMessage: "Find related videos for unit two",
    actualPrompt: "Find teaching videos for each chapter of unit two",
    icon: <VideoPlayer />,
    iconColor: "#B60071",
  },
  {
    chipMessage: "How can you help me with lesson planning?",
    actualPrompt: "How can you help me with lesson planning?",
    icon: <Help />,
    iconColor: "#505050",
  },
  {
    chipMessage: "Provide ideas for class activities related to decimals",
    actualPrompt:
      "Recommend creative lesson activities to introduce decimals",
    icon: <Idea />,
    iconColor: "#FFB200",
  },
];
