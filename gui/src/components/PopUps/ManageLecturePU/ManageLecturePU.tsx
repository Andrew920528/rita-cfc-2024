import {useEffect, useState} from "react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {useDeleteLecture} from "../../../global/globalActions";
import {useCompose} from "../../../utils/util";
import {useApiHandler} from "../../../utils/service";
import classNames from "classnames/bind";
import styles from "./ManageLecturePU.module.scss";
import {useCreateLectureWithApi} from "../../../global/manageLectureActions";

const cx = classNames.bind(styles);
type ManageLecturePUProps = {
  action: "create" | "edit";
  editLectureId?: string;
};

const ManageLecturePU = (props: ManageLecturePUProps & PopUpProps) => {
  // global states
  const user = useTypedSelector((state) => state.User);
  const currClassroom = useTypedSelector((state) => state.Classrooms.current);
  const lectures = useTypedSelector((state) => state.Lectures);
  const deleteLecture = useDeleteLecture();
  const {apiHandler} = useApiHandler({runsInBackground: true});

  const dispatch = useAppDispatch();
  // local states
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const {isComposing, handleCompositionStart, handleCompositionEnd} =
    useCompose();

  useEffect(() => {
    if (props.action === "edit") {
      let editLectureId = props.editLectureId ?? "";
      if (editLectureId === "" || !(editLectureId in lectures.dict)) return;
      setName(lectures.dict[editLectureId!].name);
    }
  }, [props.trigger]);

  function resetForm() {
    setName("");
    setNameError("");
  }
  function validateForm(): boolean {
    let validate = true;
    if (name.trim() === "") {
      setNameError("請輸入課程名稱");
      validate = false;
    } else if (
      new Set<string>(Object.values(lectures.dict).map((c) => c.name)).has(
        name.trim()
      ) &&
      props.action === "create"
    ) {
      setNameError("課堂名稱已存在");
      validate = false;
    }
    return validate;
  }

  const {handleCreateLecture, handleModifyLecture} = useCreateLectureWithApi();

  async function submitForm() {
    if (!validateForm()) {
      return;
    }
    if (props.action === "create") {
      handleCreateLecture({name});
    } else if (props.action === "edit") {
      if (props.editLectureId === undefined) {
        throw new Error("editLectureId is undefined");
      }
      handleModifyLecture({editLectureId: props.editLectureId, name});
    }

    // reset form
    resetForm();
    // close panel
    props.setTrigger(false);
    return true;
  }

  return (
    <PopUp
      {...props}
      footerBtnProps={{
        icon: <Save size={20} />,
        text: "儲存變更",
      }}
      reset={() => {
        resetForm();
      }}
      puAction={async () => {
        await submitForm();
      }}
      isComposing={isComposing}
    >
      <div className={cx("create-lecture-form")}>
        <div>
          <Textbox
            label="計畫名稱"
            errorMsg={nameError}
            mode="form"
            placeholder="請輸入計畫名稱"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            autoFocus={true}
            ariaLabel="lecture name"
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        </div>
      </div>
    </PopUp>
  );
};

export default ManageLecturePU;
