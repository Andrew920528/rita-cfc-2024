import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {generateId} from "../../utils/util";
import {ClassroomsServices} from "../../features/ClassroomsSlice";

import {LecturesServices} from "../../features/LectureSlice";
import {Lecture} from "../../schema/lecture";

type CreateLecturePUProps = {};

const CreateLecturePU = (props: CreateLecturePUProps & PopUpProps) => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
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

  function createLecture() {
    // create lecture and associative chatroom
    const newLectureId: string = user.username + "-lecture-" + generateId();
    let newLecture: Lecture = {
      id: newLectureId,
      name: name,
      type: 1,
      widgets: [],
      chatroom: "-1",
    };

    // add id to classroom's lecture list
    dispatch(
      ClassroomsServices.actions.addLecture({
        classroomId: classrooms.current,
        lectureId: newLectureId,
      })
    );

    // add new lecture to lectures dict
    dispatch(LecturesServices.actions.addLecture(newLecture));
    // set current lecture to the new lecture
    dispatch(LecturesServices.actions.setCurrent(newLectureId));
  }

  function submitForm() {
    if (!validateForm()) {
      return;
    }

    createLecture();

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
