import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {useCreateLecture} from "../../store/globalActions";

type CreateLecturePUProps = {};

const CreateLecturePU = (props: CreateLecturePUProps & PopUpProps) => {
  // global states
  const currClassroom = useTypedSelector((state) => state.Classrooms.current);
  const createLecture = useCreateLecture();
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

  function submitForm() {
    if (!validateForm()) {
      return;
    }

    createLecture({
      lectureName: name,
      classroomId: currClassroom,
      type: 1,
    });

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
        onClick: () => {
          submitForm();
        },
      }}
      reset={resetForm}
    >
      <div className="create-lecture-form">
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
          />
        </div>
      </div>
    </PopUp>
  );
};

export default CreateLecturePU;
