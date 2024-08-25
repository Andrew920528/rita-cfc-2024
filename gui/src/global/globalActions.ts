import {useCallback, useEffect, useRef, useState} from "react";
import {ChatroomsServices} from "../features/ChatroomsSlice";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {LecturesServices} from "../features/LectureSlice";
import {WidgetsServices} from "../features/WidgetsSlice";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {generateId, mimicApi} from "../utils/util";
import {WidgetType} from "../schema/widget/widget";
import {initWidget, widgetBook} from "../schema/widget/widgetFactory";
import {UserServices} from "../features/UserSlice";
import {API, EMPTY_ID} from "./constants";
import {initSchedule} from "../schema/schedule";
import {createWidgetService, useApiHandler} from "../utils/service";
import {RfServices} from "../features/RfSlice";
import {ApiServices} from "../features/ApiSlice";

/* 
 Functions that requires the use of multiple slices to perform
 a compiled logical action
*/
export const useLoginParseState = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    async (responseObj: any) => {
      sessionStorage.setItem("sessionId", responseObj.sessionId);
      let user = responseObj.user;
      if (responseObj.user.schedule) {
        responseObj.user.schedule = JSON.parse(user.schedule as string);
      } else {
        responseObj.user.schedule = initSchedule;
      }
      dispatch(UserServices.actions.parseLogin(responseObj.user));

      let classroomsDict = responseObj.classroomsDict;
      let classrooms = responseObj.user.classroomIds;
      for (let i = 0; i < classrooms.length; i++) {
        let cid = classrooms[i];
        classroomsDict[cid].lastOpenedLecture =
          classroomsDict[cid].lectureIds.length > 0
            ? classroomsDict[cid].lectureIds[0]
            : EMPTY_ID;

        let chatroomId = classroomsDict[cid].chatroomId as string;
        dispatch(
          ChatroomsServices.actions.addChatroom({
            id: chatroomId,
            messages: [],
          })
        );
      }
      let numClassrooms = responseObj.user.classroomIds.length;
      let currentClassroom =
        numClassrooms > 0
          ? responseObj.user.classroomIds[numClassrooms - 1]
          : EMPTY_ID;
      let currentChatroom =
        currentClassroom === EMPTY_ID
          ? EMPTY_ID
          : classroomsDict[currentClassroom].chatroomId;
      dispatch(
        ClassroomsServices.actions.parseLogin({
          dict: classroomsDict,
          current: currentClassroom,
        })
      );

      dispatch(ChatroomsServices.actions.setCurrent(currentChatroom as string));

      let currentLecture = EMPTY_ID;
      if (currentClassroom !== EMPTY_ID) {
        currentLecture = classroomsDict[currentClassroom]
          .lastOpenedLecture as string;
      }

      dispatch(
        LecturesServices.actions.parseLogin({
          dict: responseObj.lecturesDict,
          current: currentLecture,
        })
      );

      let currentWidget = EMPTY_ID;
      if (
        currentLecture !== EMPTY_ID &&
        responseObj.lecturesDict[currentLecture].widgetIds.length > 0
      ) {
        currentWidget = responseObj.lecturesDict[currentLecture].widgetIds[0];
      }

      for (let wid in responseObj.widgetDict) {
        let widget = responseObj.widgetDict[wid];
        responseObj.widgetDict[wid].content = JSON.parse(
          widget.content as string
        );
        responseObj.widgetDict[wid].type = parseInt(widget.type as string);
      }

      dispatch(
        WidgetsServices.actions.parseLogin({
          dict: responseObj.widgetDict,
          current: currentWidget,
        })
      );
    },
    [dispatch]
  );
};
export const useCreateWidget = () => {
  const dispatch = useAppDispatch();
  const username = useTypedSelector((state) => state.User.username);

  return useCallback(
    (args: {
      widgetType: WidgetType;
      lectureId: string;
      widgetId: string;
      position?: {x: number; y: number};
    }) => {
      // create widget

      const newWidget = initWidget(args.widgetId, args.widgetType);
      dispatch(WidgetsServices.actions.addWidget(newWidget));
      // add new widget to lecture
      dispatch(
        LecturesServices.actions.addWidget({
          lectureId: args.lectureId,
          widgetId: args.widgetId,
        })
      );
      // set current widget
      dispatch(WidgetsServices.actions.setCurrent(args.widgetId));
      if (args.position) {
        dispatch(
          RfServices.actions.addNode({
            id: args.widgetId,
            dimension: {
              x: args.position.x,
              y: args.position.y,
              width: widgetBook(args.widgetType).minWidth,
              height: widgetBook(args.widgetType).minHeight,
            },
          })
        );
      }
    },
    [dispatch, username]
  );
};
// username + "-wid-" + generateId()
export const useCreateWidgetWithApi = () => {
  const lectures = useTypedSelector((state) => state.Lectures);
  const username = useTypedSelector((state) => state.User.username);
  const deleteWidget = useDeleteWidget();
  const addWidget = useCreateWidget();
  const {apiHandler, loading, terminateResponse} = useApiHandler({
    runsInBackground: true,
  });
  const dispatch = useAppDispatch();
  const apiSignals = useTypedSelector((state) => state.Api.signals);
  const newWidgetIdRef = useRef<string>();
  // const newWidgetId = username + "-wid-" + generateId();
  useEffect(() => {
    // newWidgetIdRef.current = username + "-wid-" + generateId();
    const newWidgetId = newWidgetIdRef.current;
    if (!newWidgetId) return;
    if (newWidgetId in apiSignals && apiSignals[newWidgetId] === true) {
      terminateResponse();

      dispatch(ApiServices.actions.deleteSignal({id: newWidgetId}));
    }
  }, [apiSignals]);
  async function createWidget(
    widgetType: WidgetType,
    position?: {x: number; y: number}
  ) {
    newWidgetIdRef.current = username + "-wid-" + generateId();
    const newWidgetId = newWidgetIdRef.current;
    addWidget({
      widgetType: widgetType,
      lectureId: lectures.current,
      widgetId: newWidgetId,
      position: position,
    });

    let r = await apiHandler({
      apiFunction: (s) =>
        createWidgetService(
          {
            widgetId: newWidgetId,
            type: widgetType,
            lectureId: lectures.current,
            content: JSON.stringify(
              initWidget(newWidgetId, widgetType).content
            ),
          },
          s
        ),
      allowAsync: true,
      debug: true,
      identifier: "createWidget",
    });
    dispatch(ApiServices.actions.deleteSignal({id: newWidgetId}));
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      // If api fails, delete widget from store
      deleteWidget({lectureId: lectures.current, widgetId: newWidgetId});
      return EMPTY_ID;
    }

    return newWidgetId;
  }
  return {
    createWidget: useCallback(createWidget, [
      lectures,
      username,
      addWidget,
      deleteWidget,
      apiHandler,
    ]),
    loading: loading,
  };
};

export const useDeleteClassroom = () => {
  const dispatch = useAppDispatch();
  const deleteLecture = useDeleteLecture();
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  return useCallback(
    (args: {classroomId: string}) => {
      const lectures = classrooms.dict[args.classroomId].lectureIds;
      for (let i = 0; i < lectures.length; i++) {
        deleteLecture({lectureId: lectures[i], classroomId: args.classroomId});
      }

      // delete corresponding chatroom (to be changed)
      const chatroomId = classrooms.dict[args.classroomId].chatroomId;
      dispatch(ChatroomsServices.actions.deleteChatroom(chatroomId));

      // remove reference from users
      dispatch(UserServices.actions.deleteClassroom(args.classroomId));

      // reset current classroom if current classroom is deleted
      let defaultClassroom = EMPTY_ID;
      for (let i = 0; i < user.classroomIds.length; i++) {
        if (user.classroomIds[i] !== args.classroomId) {
          defaultClassroom = user.classroomIds[i];
          break;
        }
      }
      dispatch(ClassroomsServices.actions.setCurrent(defaultClassroom));

      // delete actual classroom
      dispatch(ClassroomsServices.actions.deleteClassroom(args.classroomId));

      if (defaultClassroom === EMPTY_ID) {
        dispatch(LecturesServices.actions.setCurrent(EMPTY_ID));
        return;
      }
      // sets lecture of the new current classroom
      const defaultLecture =
        classrooms.dict[defaultClassroom].lastOpenedLecture ??
        classrooms.dict[defaultClassroom].lectureIds[0];

      dispatch(LecturesServices.actions.setCurrent(defaultLecture));
      dispatch(
        ClassroomsServices.actions.setLastOpenedLecture({
          classroomId: defaultClassroom,
          lectureId: defaultLecture,
        })
      );
    },
    [dispatch, deleteLecture, user, classrooms]
  );
};

export const useDeleteLecture = () => {
  const dispatch = useAppDispatch();
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  const deleteWidget = useDeleteWidget();
  return useCallback(
    (args: {lectureId: string; classroomId: string}) => {
      // delete all widgets
      const widgets = lectures.dict[args.lectureId].widgetIds;
      for (let i = 0; i < widgets.length; i++) {
        deleteWidget({lectureId: args.lectureId, widgetId: widgets[i]});
      }

      dispatch(
        ClassroomsServices.actions.deleteLecture({
          classroomId: args.classroomId,
          lectureId: args.lectureId,
        })
      );
      // delete actual lecture object
      dispatch(LecturesServices.actions.deleteLecture(args.lectureId));

      // reset current lecture if current lecture is deleted
      const defaultLecture = classrooms.dict[classrooms.current].lectureIds[0];
      if (lectures.current === args.lectureId) {
        dispatch(LecturesServices.actions.setCurrent(defaultLecture));
        dispatch(
          ClassroomsServices.actions.setLastOpenedLecture({
            classroomId: classrooms.current,
            lectureId: defaultLecture,
          })
        );

        // reset widget if none is the lecture is deleted
        dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
      }
    },
    [dispatch, classrooms, lectures, deleteWidget]
  );
};

export const useDeleteWidget = () => {
  const dispatch = useAppDispatch();
  const currentWidget = useTypedSelector((state) => state.Widgets.current);
  return useCallback(
    (args: {lectureId: string; widgetId: string}) => {
      dispatch(WidgetsServices.actions.deleteWidget(args.widgetId));
      dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));

      dispatch(
        LecturesServices.actions.deleteWidget({
          lectureId: args.lectureId,
          widgetId: args.widgetId,
        })
      );
    },
    [dispatch, currentWidget]
  );
};
