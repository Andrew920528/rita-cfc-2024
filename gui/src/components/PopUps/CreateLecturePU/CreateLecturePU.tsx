import {useState} from "react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useTypedSelector} from "../../../store/store";
import {useCreateLecture} from "../../../store/globalActions";
import {generateId} from "../../../utils/util";
import {createLectureService, useApiHandler} from "../../../utils/service";
import {API_ERROR} from "../../../utils/constants";
import classNames from "classnames/bind";
import styles from "./CreateLecturePU.module.scss";

const cx = classNames.bind(styles);
type CreateLecturePUProps = {};

const CreateLecturePU = (props: CreateLecturePUProps & PopUpProps) => {
  // global states
  const user = useTypedSelector((state) => state.User);
  const currClassroom = useTypedSelector((state) => state.Classrooms.current);
  const createLecture = useCreateLecture();
  const {apiHandler, loading, terminateResponse} = useApiHandler();
  // local states
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  function resetForm() {
    setName("");
    setNameError("");
  }
  function validateForm(): boolean {
    let validate = true;
    if (name.trim() === "") {
      setNameError("請輸入課程名稱");
      validate = false;
    }
    return validate;
  }

  async function submitForm() {
    if (!validateForm()) {
      return;
    }
    const newLectureId = user.username + "-lecture-1" + generateId();
    const lectureData = {
      lectureId: newLectureId,
      classroomId: currClassroom,
      name: name,
      type: 1,
    };
    let r = await apiHandler({
      apiFunction: (s) => createLectureService(s, lectureData),
    });

    if (r.status === API_ERROR) {
      return;
    }
    createLecture(lectureData);

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
        onClick: async () => {
          await submitForm();
        },
        disabled: loading,
      }}
      reset={() => {
        resetForm();
        terminateResponse();
      }}
    >
      <div className={cx("create-lecture-form")}>
        <div>
          <Textbox
            label="課堂名稱"
            errorMsg={nameError}
            mode="form"
            placeholder="請輸入課堂名稱"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            autoFocus={true}
            ariaLabel="lecture name"
          />
        </div>
      </div>
    </PopUp>
  );
};

export default CreateLecturePU;