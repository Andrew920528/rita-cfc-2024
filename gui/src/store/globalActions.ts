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
import {EMPTY_ID} from "../global/constants";

/* 
 Functions that requires the use of multiple slices to perform
 a compiled logical action
*/

export const useCreateClassroom = () => {
  const dispatch = useAppDispatch();
  const createLecture = useCreateLecture();
  return useCallback(
    async (args: {
      classroomId: string;
      classroomName: string;
      subject: string;
      grade: string;
      publisher: string;
      credits: number;
      plan: boolean;
      chatroomId: string;
    }) => {
      // create associative classroom
      let newChatroom: Chatroom = {
        id: args.chatroomId,
        messages: [],
      };
      let newClassroom: Classroom = {
        id: args.classroomId,
        name: args.classroomName,
        subject: args.subject,
        grade: args.grade,
        publisher: args.publisher,
        lectureIds: [],
        lastOpenedLecture: EMPTY_ID,
        plan: args.plan,
        credits: args.credits,
        chatroom: args.chatroomId,
      };

      // add new chatroom to chatrooms dict
      dispatch(ChatroomsServices.actions.addChatroom(newChatroom));
      // set current chatroom to the new chatroom
      dispatch(ChatroomsServices.actions.setCurrent(args.chatroomId));

      // create classroom
      dispatch(ClassroomsServices.actions.addClassroom(newClassroom));

      // allow user to reference to the new classroom
      dispatch(UserServices.actions.addClassroom(args.classroomId));
      // set current classroom to the new classroom
      dispatch(ClassroomsServices.actions.setCurrent(args.classroomId));
    },
    [dispatch, createLecture]
  );
};

export const useCreateLecture = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    (args: {
      lectureId: string;
      name: string;
      classroomId: string;
      type: number;
    }) => {
      // create lecture
      let newLecture: Lecture = {
        id: args.lectureId,
        name: args.name,
        type: args.type,
        widgetIds: [],
      };

      // add reference to classroom's lecture list
      dispatch(
        ClassroomsServices.actions.addLecture({
          classroomId: args.classroomId,
          lectureId: args.lectureId,
        })
      );
      // set last opened lecture as the newly created lecture
      dispatch(
        ClassroomsServices.actions.setLastOpenedLecture({
          classroomId: args.classroomId,
          lectureId: args.lectureId,
        })
      );

      // add new lecture to lectures dict
      dispatch(LecturesServices.actions.addLecture(newLecture));
      // set current lecture to the new lecture
      dispatch(LecturesServices.actions.setCurrent(args.lectureId));
    },
    [dispatch]
  );
};

export const useCreateWidget = () => {
  const dispatch = useAppDispatch();
  const username = useTypedSelector((state) => state.User.username);
  return useCallback(
    (args: {widgetType: WidgetType; lectureId: string; widgetId: string}) => {
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
