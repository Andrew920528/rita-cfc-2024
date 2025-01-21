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
import {TText} from "../../TText/TText";
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
          <p className={cx("ask")}>
            <TText>Are you sure that you want to delete this lesson plan??</TText>
          </p>
          <p className="--label">
            <TText>You are permanently deleting the contents of this lesson plan.</TText>
          </p>
        </div>

        <IconButton
          icon={<TrashCan />}
          text="Delete"
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
