import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {formatDate} from "../../utils/util";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {Session} from "../../schema/session";
import {SessionsServices} from "../../features/SessionsSlice";

type CreateSessionPUProps = {};

const CreateSessionPU = (props: CreateSessionPUProps & PopUpProps) => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const sessions = useTypedSelector((state) => state.Sessions);
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

  function createSession() {
    // create Session and associative chatroom
    const newSessionId: string =
      user.username + "-session-" + formatDate(new Date());
    let newSession: Session = {
      id: newSessionId,
      name: name,
      type: 1,
      widgets: [],
      chatroom: "-1",
    };

    // add id to classroom's session list
    dispatch(
      ClassroomsServices.actions.addSession({
        classroomId: classrooms.current,
        sessionId: newSessionId,
      })
    );

    // add new session to sessions dict
    dispatch(SessionsServices.actions.addSession(newSession));
    // set current session to the new session
    dispatch(SessionsServices.actions.setCurrent(newSessionId));
  }

  function submitForm() {
    if (!validateForm()) {
      return;
    }

    createSession();

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
      <div className="create-session-form">
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

export default CreateSessionPU;
