import React, {useCallback, useState} from "react";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {Classroom} from "../schema/classroom";
import {AGENCY, API, EMPTY_ID} from "./constants";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {UserServices} from "../features/UserSlice";
import {Lecture} from "../schema/lecture";
import {LecturesServices} from "../features/LectureSlice";
import {
  createClassroomService,
  createLectureService,
  deleteClassroomService,
  updateClassroomService,
  useApiHandler,
} from "../utils/service";
import {ChatroomsServices} from "../features/ChatroomsSlice";
import {useDeleteClassroom} from "./globalActions";
import {generateId} from "../utils/util";
import {toast} from "react-toastify";

export const useCreateClassroomWithApi = () => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const deleteClassroomFrontend = useDeleteClassroom();
  // api handler
  const {apiHandler} = useApiHandler({
    runsInBackground: true,
  });
  // local states
  /**
   * Creates a classroom and corresponding lecture
   * The classroom will be set on loading and can be run async & in background
   * @param param0
   * @returns
   */
  async function createClassroom({
    name,
    subject,
    grade,
    publisher,
    credit,
  }: {
    name: string;
    subject: string;
    grade: string;
    publisher: string;
    credit: number;
  }) {
    const newClassroomId: string = user.username + "-classroom-" + generateId();
    const newLectureId: string = user.username + "-lecture-0" + generateId();
    let classroomData = {
      classroomId: newClassroomId,
      classroomName: name,
      subject: subject,
      publisher: publisher,
      grade: grade,
      plan: false,
      credits: credit,
    };

    let lectureData = {
      lectureId: newLectureId,
      name: "Semester Planning",
      classroomId: newClassroomId,
      type: 0,
    };

    /*
    1. create classroom and lecture in frontend, set loading to true
    2. create classroom and lecture in backend
    3. if failed, delete classroom and lecture in frontend
    4. if success, 
      4.1. get the chatroom response and set corresponding chatroom
      4.2. set loading to false
    */
    let newClassroom: Classroom = {
      id: newClassroomId,
      name: name,
      subject: subject,
      publisher: publisher,
      grade: grade,
      plan: false,
      credits: credit,
      lectureIds: [],
      lastOpenedLecture: EMPTY_ID,
    };
    // create classroom
    dispatch(ClassroomsServices.actions.addClassroom(newClassroom));
    // set loading to true
    dispatch(
      ClassroomsServices.actions.setLoading({
        id: newClassroomId,
        loading: true,
      })
    );
    // allow user to reference to the new classroom
    dispatch(UserServices.actions.addClassroom(newClassroomId));

    let newLecture: Lecture = {
      id: newLectureId,
      name: "Semester Planning",
      type: 0,
      widgetIds: [],
      chatroomId: EMPTY_ID,
    };

    // add reference to classroom's lecture list
    dispatch(
      ClassroomsServices.actions.addLecture({
        classroomId: newClassroomId,
        lectureId: newLectureId,
      })
    );

    // set last opened lecture as the newly created lecture
    dispatch(
      ClassroomsServices.actions.setLastOpenedLecture({
        classroomId: newClassroomId,
        lectureId: newLectureId,
      })
    );
    // add new lecture to lectures dict
    dispatch(LecturesServices.actions.addLecture(newLecture));

    let r = await apiHandler({
      apiFunction: () =>
        createClassroomService({
          ...classroomData,
        }),
      debug: true,
      identifier: "createClassroom",
      allowAsync: true,
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("Failed to create classroom, please check connection.");
      // delete classroom (and lecture) in frontend
      deleteClassroomFrontend({classroomId: newClassroomId});
      return;
    }

    r = await apiHandler({
      apiFunction: (s) => createLectureService(lectureData, s),
      debug: true,
      identifier: "createLecture",
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("Failed to create classroom, please check connection.");
      // delete classroom (and lecture) in frontend
      deleteClassroomFrontend({classroomId: newClassroomId});
      // delete classroom in backend
      await apiHandler({
        apiFunction: () =>
          deleteClassroomService({classroomId: newClassroomId}),
        debug: true,
        identifier: "deleteClassroom",
        allowAsync: true,
      });
      return;
    }
    // Success clean up
    // add new chatroom to chatrooms dict
    const newChatroomId = r.data["chatroomId"];
    dispatch(
      ChatroomsServices.actions.addChatroom({
        id: newChatroomId,
        messages: [],
        agency: AGENCY.LECTURE,
      })
    );
    dispatch(
      LecturesServices.actions.setChatroom({
        lectureId: newLectureId,
        chatroomId: newChatroomId,
      })
    );
    dispatch(
      ClassroomsServices.actions.setLoading({
        id: newClassroomId,
        loading: false,
      })
    );

    if (user.classroomIds.length === 0) {
      dispatch(ClassroomsServices.actions.setCurrent(newClassroomId));
      dispatch(LecturesServices.actions.setCurrent(newLectureId));
    }
  }

  return {
    createClassroom: useCallback(createClassroom, [
      dispatch,
      user,
      apiHandler,
      deleteClassroomFrontend,
    ]),
  };
};

export const useEditClassroomWithApi = () => {
  const dispatch = useAppDispatch();
  const {apiHandler} = useApiHandler({
    runsInBackground: true,
  });
  async function editClassroom({
    editClassroomId,
    name,
    subject,
    grade,
    publisher,
    credit,
  }: {
    editClassroomId: string;
    name: string;
    subject: string;
    grade: string;
    publisher: string;
    credit: number;
  }) {
    // update global states
    const classroomId = editClassroomId;
    let newClassroom: Classroom = {
      id: classroomId,
      name: name,
      subject: subject,
      grade: grade,
      publisher: publisher,
      // these are not editable
      lectureIds: [],
      lastOpenedLecture: "",
      plan: false,
      credits: credit,
    };
    // update classroom to classrooms dict
    dispatch(ClassroomsServices.actions.editClassroom(newClassroom));
    dispatch(
      ClassroomsServices.actions.setLoading({
        id: classroomId,
        loading: true,
      })
    );
    let r = await apiHandler({
      apiFunction: (s) =>
        updateClassroomService(
          {
            classroomId: classroomId,
            classroomName: name,
            subject: subject,
            publisher: publisher,
            grade: grade,
            credits: credit,
          },
          s
        ),
      debug: true,
      identifier: "editClassroom",
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("Failed to save changes, please check connection.");
    }
    dispatch(
      ClassroomsServices.actions.setLoading({
        id: classroomId,
        loading: false,
      })
    );
  }
  return {
    editClassroom: useCallback(editClassroom, [dispatch, apiHandler]),
  };
};
