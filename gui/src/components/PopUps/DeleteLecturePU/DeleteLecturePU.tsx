import React from "react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import IconButton from "../../ui_components/IconButton/IconButton";
import {TrashCan} from "@carbon/icons-react";
import {useDeleteLecture} from "../../../global/globalActions";
import {deleteLectureService, useApiHandler} from "../../../utils/service";
import {useTypedSelector} from "../../../store/store";
import {API} from "../../../global/constants";
import classNames from "classnames/bind";
import styles from "./DeleteLecturePU.module.scss";
type Props = {lectureId: string};
const cx = classNames.bind(styles);
function DeleteLecturePU(props: Props & PopUpProps) {
  const deleteLectureState = useDeleteLecture();
  const {apiHandler} = useApiHandler();
  const classrooms = useTypedSelector((state) => state.Classrooms);

  async function deleteLecture(lectureId: string) {
    deleteLectureState({lectureId: lectureId, classroomId: classrooms.current});
    let r = await apiHandler({
      apiFunction: () =>
        deleteLectureService({
          lectureId: lectureId,
          classroomId: classrooms.current,
        }),
      debug: true,
      identifier: "deleteLecture",
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      return;
    }
  }
  return (
    <PopUp {...props}>
      <div className={cx("content")}>
        <div className={cx("words")}>
          <p className={cx("ask")}>確定要刪除此課程計畫嗎?</p>
          <p className="--label">您將永久刪除此課程計畫的內容。</p>
        </div>

        <IconButton
          icon={<TrashCan />}
          text="刪除"
          mode="danger-outline"
          onClick={() => {
            deleteLecture(props.lectureId);
            props.setTrigger(false);
          }}
        />
      </div>
    </PopUp>
  );
}

export default DeleteLecturePU;
