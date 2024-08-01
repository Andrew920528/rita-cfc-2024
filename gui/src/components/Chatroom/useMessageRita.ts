import {Dispatch, SetStateAction, useCallback} from "react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {messageRitaService, useApiHandler} from "../../utils/service";
import {SENDER} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {contentIsOfType, widgetBook} from "../../schema/widget";
import {EMPTY_ID} from "../../global/constants";
import {WidgetsServices} from "../../features/WidgetsSlice";

export const useMessageRita = () => {
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
  async function sendMessage(
    text: string,
    setText: Dispatch<SetStateAction<string>>,
    setRitaError: Dispatch<SetStateAction<string>>
  ) {
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
                JSON.stringify(widgets.dict[widgets.current].content)
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

      let organizer = {
        currRitaReply: "",
      };
      let buffer: string[] = [];
      let total = [];
      while (true) {
        const {done, value} = await reader!.read();
        if (done) break;
        let newChunk = decoder.decode(value);
        total.push(newChunk);
        extractCompleteChunk(newChunk, buffer);
        while (true) {
          let l = buffer.shift();
          if (!l) break;
          handleChunk(l, organizer);
        }
      }
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

  function extractCompleteChunk(newChunk: string, buffer: string[]) {
    // There are cases where, multiple chunks are read the same time.
    // We need to ensure one chunk is read at a time
    const delimiter = "|T|";
    let newChunks = newChunk.split(delimiter);

    for (let chunk of newChunks) {
      if (chunk === "") continue;
      buffer.push(chunk);
    }
    return buffer;
  }

  function handleChunk(chunk: string, organizer: any) {
    let streamObject;
    try {
      streamObject = JSON.parse(chunk);
    } catch (error) {
      console.error(
        "Error happened when parsing chunk:" + chunk + "\n" + error
      );
      return;
    }

    let agent = streamObject.agent;
    let data = streamObject.data;

    if (agent === "Rita") {
      organizer.currRitaReply += data;
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
    } else if (agent === "Widget Modifier") {
      handleWidgetModification(data);
    }
  }

  function handleWidgetModification(modify_widget_data: any) {
    let widgetId = modify_widget_data.widgetId;

    if (
      !widgetId ||
      widgetId === "" ||
      widgetId !== widgets.current ||
      widgetId === EMPTY_ID
    ) {
      return;
    }
    let widgetContent = modify_widget_data.widgetContent;

    if (!contentIsOfType(widgets.dict[widgets.current].type, widgetContent)) {
      console.warn(
        "Attempted to modify widget with wrong content format",
        widgetContent
      );
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
      text: `更新了${widgetBook[widgets.dict[widgets.current].type].title}`,
      sender: SENDER.system,
    };

    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: messageObj,
      })
    );
  }

  return {sendMessage, waitingForReply, terminateResponse};
};
