import {useCallback, useRef, useState} from "react";
import {ChatroomsServices} from "../features/ChatroomsSlice";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {LecturesServices} from "../features/LectureSlice";
import {WidgetsServices} from "../features/WidgetsSlice";
import {useAppDispatch, useTypedSelector} from "./store";
import {generateId, mimicApi} from "../utils/util";
import {WidgetType, initWidget} from "../schema/widget";
import {Chatroom} from "../schema/chatroom";
import {Lecture} from "../schema/lecture";
import {Classroom} from "../schema/classroom";
import {UserServices} from "../features/UserSlice";
import {EMPTY_ID} from "../utils/constants";

/* 
 Functions that requires the use of multiple slices to perform
 a compiled logical action
*/

export const useCreateClassroom = () => {
  const dispatch = useAppDispatch();
  const username = useTypedSelector((state) => state.User.username);
  const createLecture = useCreateLecture();
  return useCallback(
    async (args: {
      classroomName: string;
      subject: string;
      otherSubject: string;
      grade: string;
      publisher: string;
      credits: number;
    }) => {
      // create associative classroom
      const newChatroomId: string = username + "-chatroom-" + generateId();
      let newChatroom: Chatroom = {
        id: newChatroomId,
        messages: [],
      };

      const newClassroomId: string = username + "-classroom-" + generateId();
      let newClassroom: Classroom = {
        id: newClassroomId,
        name: args.classroomName,
        subject: args.subject === "其他" ? args.otherSubject : args.subject,
        grade: args.grade,
        publisher: args.subject === "其他" ? "綜合" : args.publisher,
        lectures: [],
        lastOpenedLecture: EMPTY_ID,
        plan: false,
        credits: args.credits,
        chatroom: newChatroomId,
      };

      // add new chatroom to chatrooms dict
      dispatch(ChatroomsServices.actions.addChatroom(newChatroom));
      // set current chatroom to the new chatroom
      dispatch(ChatroomsServices.actions.setCurrent(newChatroomId));

      // create classroom
      dispatch(ClassroomsServices.actions.addClassroom(newClassroom));

      // create initial lecture & corresponding chatroom
      createLecture({
        lectureName: "學期規劃",
        classroomId: newClassroomId,
        type: 0,
      });

      // allow user to reference to the new classroom
      dispatch(UserServices.actions.addClassroom(newClassroomId));
      // set current classroom to the new classroom
      dispatch(ClassroomsServices.actions.setCurrent(newClassroomId));
    },
    [dispatch, username, createLecture]
  );
};

export const useCreateLecture = () => {
  const dispatch = useAppDispatch();
  const username = useTypedSelector((state) => state.User.username);
  return useCallback(
    (args: {lectureName: string; classroomId: string; type: number}) => {
      const newLectureId: string =
        username + "-lecture-" + args.type + generateId();

      // create lecture
      let newLecture: Lecture = {
        id: newLectureId,
        name: args.lectureName,
        type: args.type,
        widgets: [],
      };

      // add reference to classroom's lecture list
      dispatch(
        ClassroomsServices.actions.addLecture({
          classroomId: args.classroomId,
          lectureId: newLectureId,
        })
      );
      // set last opened lecture as the newly created lecture
      dispatch(
        ClassroomsServices.actions.setLastOpenedLecture({
          classroomId: args.classroomId,
          lectureId: newLectureId,
        })
      );

      // add new lecture to lectures dict
      dispatch(LecturesServices.actions.addLecture(newLecture));
      // set current lecture to the new lecture
      dispatch(LecturesServices.actions.setCurrent(newLectureId));
    },
    [dispatch, username]
  );
};

export const useCreateWidget = () => {
  const dispatch = useAppDispatch();
  const username = useTypedSelector((state) => state.User.username);
  return useCallback(
    (args: {widgetType: WidgetType; lectureId: string}) => {
      // create widget
      const newWidgetId = username + "-wid-" + generateId();
      const newWidget = initWidget(newWidgetId, args.widgetType);
      dispatch(WidgetsServices.actions.addWidget(newWidget));
      // add new widget to lecture
      dispatch(
        LecturesServices.actions.addWidget({
          lectureId: args.lectureId,
          widgetId: newWidgetId,
        })
      );
      // set current widget
      dispatch(WidgetsServices.actions.setCurrent(newWidgetId));
    },
    [dispatch, username]
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
      const widgets = lectures.dict[args.lectureId].widgets;
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
      const defaultLecture = classrooms.dict[classrooms.current].lectures[0];
      if (lectures.current === args.lectureId) {
        dispatch(LecturesServices.actions.setCurrent(defaultLecture));
        dispatch(
          ClassroomsServices.actions.setLastOpenedLecture({
            classroomId: classrooms.current,
            lectureId: defaultLecture,
          })
        );
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
      if (args.widgetId === currentWidget) {
        dispatch(WidgetsServices.actions.setCurrent(EMPTY_ID));
      }
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
