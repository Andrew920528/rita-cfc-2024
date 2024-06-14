import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import IconButton from "../ui_components/IconButton";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {UserServices} from "../../features/UserSlice";
import Dropdown from "../ui_components/Dropdown";
import {Classroom} from "../../schema/classroom";
import {formatDate} from "../../utils/util";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {Session} from "../../schema/session";
import {SessionsServices} from "../../features/SessionsSlice";

type ManageClassroomPUProps = {
  action: "create" | "edit";
  editClassroomId?: string;
};

export const subjectDict = {
  國文: "",
  數學: "",
  其他: "",
};

export const gradeDict = {
  五上: "",
  五下: "",
  六上: "",
  六下: "",
};

export const publisherDict = {
  康軒: "",
};
const ManageClassroomPU = (props: ManageClassroomPUProps & PopUpProps) => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const classrooms = useTypedSelector((state) => state.Classrooms);
  // local states
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [otherSubject, setOtherSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [publisher, setPublisher] = useState("");

  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [otherSubjectError, setOtherSubjectError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [publisherError, setPublisherError] = useState("");

  useEffect(() => {
    if (props.action === "edit") {
      let editClassroomId = props.editClassroomId ? props.editClassroomId : "";
      if (editClassroomId === "" || !(editClassroomId in classrooms.dict))
        return;
      setName(classrooms.dict[editClassroomId!].name);
      if (classrooms.dict[editClassroomId!].subject in subjectDict) {
        setSubject(classrooms.dict[editClassroomId!].subject);
      } else {
        setSubject("其他");
        setOtherSubject(classrooms.dict[editClassroomId!].subject);
      }
      setGrade(classrooms.dict[editClassroomId!].grade);
      setPublisher(classrooms.dict[editClassroomId!].publisher);
    }
  }, [props.trigger, classrooms.current]);

  function resetForm() {
    setName("");
    setSubject("");
    setOtherSubject("");
    setGrade("");
    setPublisher("");

    setNameError("");
    setSubjectError("");
    setOtherSubjectError("");
    setGradeError("");
    setPublisherError("");
  }
  function validateForm(): boolean {
    let validate = true;
    if (name.trim() === "") {
      setNameError("請輸入課堂名稱");
      validate = false;
    }
    if (subject.trim() === "") {
      setSubjectError("請輸入科目");
      validate = false;
    }
    if (subject === "其他" && otherSubject.trim() === "") {
      setOtherSubjectError("請輸入科目");
      validate = false;
    }
    if (grade.trim() === "") {
      setGradeError("請選擇年級");
      validate = false;
    }
    if (subject !== "其他" && publisher.trim() === "") {
      setPublisherError("請選擇教材");
      validate = false;
    }
    return validate;
  }

  function createClassroom() {
    const newSessionId = user.username + "-session-0-" + formatDate(new Date());
    let newSession: Session = {
      id: newSessionId,
      name: "學期規劃",
      type: 0,
      widgets: [],
      chatroom: "-1",
    };

    const newClassroomId: string =
      user.username + "-classroom-" + formatDate(new Date());
    let newClassroom: Classroom = {
      id: newClassroomId,
      name: name,
      subject: subject === "其他" ? otherSubject : subject,
      grade: grade,
      publisher: subject === "其他" ? "綜合" : publisher,
      sessions: [newSessionId],
      lastOpenedSession: newSessionId,
      plan: false,
    };
    dispatch(SessionsServices.actions.addSession(newSession));
    // add id to user's classrooms list
    dispatch(UserServices.actions.addClassroom(newClassroomId));
    // add new classroom to classrooms dict
    dispatch(ClassroomsServices.actions.addClassroom(newClassroom));
    // set current classroom to the new classroom
    dispatch(ClassroomsServices.actions.setCurrent(newClassroomId));
    // set current session to the new session
    dispatch(SessionsServices.actions.setCurrent(newSessionId));
  }

  function editClassroom() {
    // update global states
    if (props.editClassroomId === undefined) {
      throw new Error("editClassroomId is undefined");
    }
    const classroomId = props.editClassroomId ? props.editClassroomId : "";
    let newClassroom: Classroom = {
      id: classroomId,
      name: name,
      subject: subject === "其他" ? otherSubject : subject,
      grade: grade,
      publisher: subject === "其他" ? "綜合" : publisher,
      // these are not editable
      sessions: [],
      lastOpenedSession: "",
      plan: false,
    };

    // update classroom to classrooms dict
    dispatch(ClassroomsServices.actions.editClassroom(newClassroom));
  }

  function submitForm() {
    if (!validateForm()) {
      return;
    }

    if (props.action === "create") {
      createClassroom();
    } else if (props.action === "edit") {
      editClassroom();
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
        onClick: () => {
          submitForm();
        },
      }}
      reset={resetForm}
    >
      <div className="create-classroom-form">
        <div className="ccf-layout-first-row">
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
          <div>
            <Dropdown
              currId={grade}
              setCurrId={setGrade}
              idDict={gradeDict}
              getName={(id) => {
                return id;
              }}
              placeholder="請選擇年級"
              flex={true}
              mode="form"
              errorMsg={gradeError}
              label="年級"
            />
          </div>
        </div>

        <Dropdown
          currId={subject}
          setCurrId={setSubject}
          idDict={subjectDict}
          getName={(id) => {
            return id;
          }}
          placeholder="請選擇科目"
          flex={true}
          mode="form"
          errorMsg={subjectError}
          label="科目"
        />

        {subject !== "其他" ? (
          <Dropdown
            currId={publisher}
            setCurrId={setPublisher}
            idDict={publisherDict}
            getName={(id) => {
              return id;
            }}
            placeholder="請選擇教材"
            flex={true}
            mode="form"
            errorMsg={publisherError}
            label="教材"
          />
        ) : (
          <Textbox
            label="其他科目"
            errorMsg={otherSubjectError}
            mode="form"
            placeholder="請輸入科目名稱"
            value={otherSubject}
            onChange={(e) => {
              setOtherSubject(e.currentTarget.value);
            }}
          />
        )}
      </div>
    </PopUp>
  );
};

export default ManageClassroomPU;
