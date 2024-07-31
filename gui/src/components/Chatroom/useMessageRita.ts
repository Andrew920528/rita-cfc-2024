import {Dispatch, SetStateAction, useCallback} from "react";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {messageRitaService, useApiHandler} from "../../utils/service";
import {SENDER} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";
import {tags} from "./ChunkDefinitions";
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

      // const eventSource = new EventSource('http://127.0.0.1:5000/message-rita');

      // eventSource.onmessage = (event) => {
      //     console.log(event.data)
      // };

      // eventSource.onerror = (err) => {
      //     console.error('EventSource failed:', err);
      //     eventSource.close();
      // };


      // return

      let response = await messageRitaService(
        {...payload},
        abortControllerRef?.current?.signal
      );

      const reader = response.body?.getReader();

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
      }
      console.log(organizer);
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
      organizer.currModifyingWidgetContent += chunk;
    } else if (organizer.currTag === "<wid>") {
      organizer.currModifyingWidgetId += chunk.trim();
    }
  }

  function handleWidgetModification(organizer: any) {
    if (organizer.currModifyingWidgetContent === "") return;
    let widgetContent;
    try {
      widgetContent = JSON.parse(organizer.currModifyingWidgetContent);
    } catch (error) {
      console.error(error);
      return;
    }
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
  }

  return {sendMessage, waitingForReply, terminateResponse};
};
