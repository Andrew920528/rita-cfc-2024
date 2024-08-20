import React from "react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch} from "../../../store/store";
import {useDeleteClassroom} from "../../../global/globalActions";
import IconButton from "../../ui_components/IconButton/IconButton";
import {TrashCan} from "@carbon/icons-react";
import {
  deleteClassroomService,
  deleteLectureService,
  useApiHandler,
} from "../../../utils/service";
import {API} from "../../../global/constants";
import {toast} from "react-toastify";

type Props = {classroomId: string};

const DeleteClassroomPU = (props: Props & PopUpProps) => {
  const deleteClassroom = useDeleteClassroom();
  const {apiHandler} = useApiHandler();

  const handleDelete = async () => {
    deleteClassroom({classroomId: props.classroomId});
    let r = await apiHandler({
      apiFunction: () =>
        deleteClassroomService({classroomId: props.classroomId}),
      debug: true,
      identifier: "deleteClassroom",
    });
    if (r.status === API.ERROR) {
      toast.error("刪除失敗，請重試");
    }
  };
  return (
    <PopUp {...props}>
      <p>確定要刪除此教室嗎?</p>
      <p className="--label">您將永久刪除此教室與其中的所有課程計畫</p>
      <IconButton
        icon={<TrashCan />}
        text="刪除"
        mode="danger-outline"
        onClick={() => {
          handleDelete();
          props.setTrigger(false);
        }}
      />
    </PopUp>
  );
};

export default DeleteClassroomPU;
