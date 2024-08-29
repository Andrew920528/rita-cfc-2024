import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {messageRitaService, useApiHandler} from "../../utils/service";
import {SENDER} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {contentIsOfType, widgetBook} from "../../schema/widget/widgetFactory";
import {EMPTY_ID, WIDGET_MODIFIER_START_TOKEN} from "../../global/constants";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {replaceTabsWithSpaces} from "../../utils/util";

export const useMessageRita = (chatroomId: string) => {
  const dispatch = useAppDispatch();
  const chatroom = useTypedSelector(
    (state) => state.Chatrooms.dict[chatroomId]
  );

  const classroomId = useTypedSelector((state) => state.Classrooms.current);
  const lecture = useTypedSelector(
    (state) => state.Lectures.dict[state.Lectures.current]
  );
  const widgets = useTypedSelector((state) => state.Widgets);
  // api handlers
  const {abortControllerRef, terminateResponse} = useApiHandler({
    dependencies: [classroomId],
    runsInBackground: true,
  });

  const [ritaError, setRitaError] = useState("");
  const [constructingWidget, setConstructingWidget] = useState(false);

  function setWaitingForReply(waiting: boolean) {
    dispatch(
      ChatroomsServices.actions.setWaitingForReply({
        chatroomId: chatroom.id,
        waiting: waiting,
      })
    );
  }

  async function sendMessage(text: string) {
    abortControllerRef.current = new AbortController();
    let newMessage = {
      text: text,
      sender: SENDER.user,
      completed: true,
    };
    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: newMessage,
      })
    );
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
        completed: false,
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
      data = replaceTabsWithSpaces(data); // markdown renderer does not support tabs
      organizer.currRitaReply += data;
      let messageObj = {
        text: organizer.currRitaReply,
        sender: SENDER.ai,
        completed: false,
      };

      dispatch(
        ChatroomsServices.actions.updateLastMessage({
          chatroomId: chatroom.id,
          message: messageObj,
        })
      );
    } else if (agent === "Widget Modifier") {
      if (data === WIDGET_MODIFIER_START_TOKEN) {
        let messageObj = {
          text: organizer.currRitaReply,
          sender: SENDER.ai,
          completed: true, // sets completed to true
        };

        dispatch(
          ChatroomsServices.actions.updateLastMessage({
            chatroomId: chatroom.id,
            message: messageObj,
          })
        );
        setConstructingWidget(true);
        return;
      }
      handleWidgetModification(data);
      setConstructingWidget(false);
    }
  }

  function handleWidgetModification(modify_widget_data: any) {
    if (widgets.current === EMPTY_ID) return;

    try {
      modify_widget_data = JSON.parse(modify_widget_data);
      console.log("modify_widget_data", modify_widget_data);
    } catch (error) {
      console.error("Failed to parse modify_widget_data" + error);
      return;
    }

    let widgetId = modify_widget_data.widgetId;

    let widgetContent = modify_widget_data.widgetContent;

    if (!contentIsOfType(widgets.dict[widgets.current].type, widgetContent)) {
      console.warn(
        "Attempted to modify widget with wrong content format",
        widgetContent
      );
      return;
    }

    dispatch(
      WidgetsServices.actions.addPreviewWidget({
        id: widgetId,
        type: widgets.dict[widgets.current].type,
        content: widgetContent,
      })
    );

    let messageObj = {
      text: `更新了${widgetBook(widgets.dict[widgets.current].type).title}`,
      sender: SENDER.system,
      completed: true,
    };

    dispatch(
      ChatroomsServices.actions.addMessage({
        chatroomId: chatroom.id,
        message: messageObj,
      })
    );
  }

  return {
    sendMessage,
    constructingWidget,
    terminateResponse,
    ritaError,
  };
};
