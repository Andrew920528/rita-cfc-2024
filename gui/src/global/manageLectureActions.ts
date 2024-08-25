import {useCallback} from "react";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {LecturesServices} from "../features/LectureSlice";
import {Lecture} from "../schema/lecture";
import {useAppDispatch, useTypedSelector} from "../store/store";
import {
  createLectureService,
  updateLectureService,
  useApiHandler,
} from "../utils/service";
import {generateId} from "../utils/util";
import {API} from "./constants";
import {useDeleteLecture} from "./globalActions";
import {toast} from "react-toastify";

export const useCreateLectureWithApi = () => {
  const user = useTypedSelector((state) => state.User);
  const currClassroom = useTypedSelector((state) => state.Classrooms.current);
  const deleteLecture = useDeleteLecture();
  const {apiHandler} = useApiHandler({runsInBackground: true});

  const dispatch = useAppDispatch();
  async function handleCreateLecture({name}: {name: string}) {
    const newLectureId = user.username + "-lecture-1" + generateId();
    const lectureData = {
      lectureId: newLectureId,
      classroomId: currClassroom,
      name: name,
      type: 1,
    };

    let newLecture: Lecture = {
      id: newLectureId,
      name: name,
      type: 1,
      widgetIds: [],
    };

    // add reference to classroom's lecture list
    dispatch(
      ClassroomsServices.actions.addLecture({
        classroomId: currClassroom,
        lectureId: newLectureId,
      })
    );
    // set last opened lecture as the newly created lecture
    dispatch(
      ClassroomsServices.actions.setLastOpenedLecture({
        classroomId: currClassroom,
        lectureId: newLectureId,
      })
    );

    // add new lecture to lectures dict
    dispatch(LecturesServices.actions.addLecture(newLecture));
    // set loading to true
    dispatch(
      LecturesServices.actions.setLoading({id: newLectureId, loading: true})
    );

    let r = await apiHandler({
      apiFunction: () => createLectureService(lectureData),
      debug: true,
      identifier: "createLecture",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      // remove lecture from frontend
      deleteLecture({lectureId: newLectureId, classroomId: currClassroom});
    }
    dispatch(
      LecturesServices.actions.setLoading({id: newLectureId, loading: false})
    );
  }

  async function handleModifyLecture({
    editLectureId,
    name,
  }: {
    editLectureId: string;
    name: string;
  }) {
    if (editLectureId === undefined) {
      throw new Error("editLectureId is undefined");
    }

    dispatch(
      LecturesServices.actions.editLecture({
        name: name,
        id: editLectureId,
      })
    );

    dispatch(
      LecturesServices.actions.setLoading({
        id: editLectureId,
        loading: true,
      })
    );

    let r = await apiHandler({
      apiFunction: () =>
        updateLectureService({
          lectureName: name,
          lectureId: editLectureId!!,
        }),
      debug: true,
      identifier: "updateLecture",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("修改課堂名稱失敗");
    }
    dispatch(
      LecturesServices.actions.setLoading({
        id: editLectureId,
        loading: false,
      })
    );
  }

  return {
    handleCreateLecture: useCallback(handleCreateLecture, [
      apiHandler,
      deleteLecture,
      dispatch,
      user,
      currClassroom,
    ]),

    handleModifyLecture: useCallback(handleModifyLecture, [
      apiHandler,
      dispatch,
      user,
      currClassroom,
    ]),
  };
};
