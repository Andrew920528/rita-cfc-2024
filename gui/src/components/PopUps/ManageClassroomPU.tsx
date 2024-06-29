import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import Dropdown from "../ui_components/Dropdown/Dropdown";
import {Classroom} from "../../schema/classroom";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {useCreateClassroom, useCreateLecture} from "../../store/globalActions";
import {generateId, isNumeric} from "../../utils/util";
import {API_ERROR, EMPTY_ID} from "../../utils/constants";
import {
  createClassroomService,
  createLectureService,
  updateClassroomService,
  useApiHandler,
} from "../../utils/service";

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
  const createClassroomState = useCreateClassroom();
  const createLecture = useCreateLecture();

  // local states
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [otherSubject, setOtherSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [publisher, setPublisher] = useState("");
  const [credit, setCredit] = useState("3");

  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [otherSubjectError, setOtherSubjectError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [publisherError, setPublisherError] = useState("");
  const [creditError, setCreditError] = useState("");
  // api handler
  const {apiHandler, loading, terminateResponse} = useApiHandler();

  useEffect(() => {
    // ensures the classroom to be edited exists, then populates the form
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
      setCredit(classrooms.dict[editClassroomId!].credits.toString());
    }
  }, [props.trigger]);

  function resetForm() {
    setName("");
    setSubject("");
    setOtherSubject("");
    setGrade("");
    setPublisher("");
    setCredit("3");

    setNameError("");
    setSubjectError("");
    setOtherSubjectError("");
    setGradeError("");
    setPublisherError("");
    setCreditError("");
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
    if (isNumeric(credit) === false || parseInt(credit) <= 0) {
      setCreditError("請輸入正整數");
      validate = false;
    }
    return validate;
  }

  async function createClassroom() {
    const newChatroomId: string = user.username + "-chatroom-" + generateId();
    const newClassroomId: string = user.username + "-classroom-" + generateId();
    const newLectureId: string = user.username + "-lecture-0" + generateId();
    let classroomData = {
      classroomId: newClassroomId,
      classroomName: name,
      subject: subject === "其他" ? otherSubject : subject,
      publisher: subject === "其他" ? "綜合" : publisher,
      grade: grade,
      plan: false,
      credits: parseInt(credit),
      chatroomId: newChatroomId,
    };

    let r = await apiHandler({
      apiFunction: (s) =>
        createClassroomService(s, {
          username: user.username,
          ...classroomData,
        }),
      debug: true,
      identifier: "createClassroom",
    });
    if (r.status === API_ERROR) {
      return;
    }
    let lectureData = {
      lectureId: newLectureId,
      name: "學期規劃",
      classroomId: newClassroomId,
      type: 0,
    };
    r = await apiHandler({
      apiFunction: (s) => createLectureService(s, lectureData),
      debug: true,
      identifier: "createLecture",
    });
    if (r.status === API_ERROR) {
      return;
    }
    createClassroomState(classroomData);
    // create initial lecture & corresponding chatroom
    createLecture(lectureData);
  }

  async function editClassroom() {
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
      lectures: [],
      lastOpenedLecture: "",
      plan: false,
      credits: parseInt(credit),
      chatroom: EMPTY_ID,
    };
    let r = await apiHandler({
      apiFunction: (s) =>
        updateClassroomService(s, {
          classroomId: classroomId,
          classroomName: name,
          subject: subject === "其他" ? otherSubject : subject,
          publisher: subject === "其他" ? "綜合" : publisher,
          grade: grade,
          credits: parseInt(credit),
        }),
      debug: true,
      identifier: "editClassroom",
    });
    if (r.status === API_ERROR) {
      return;
    }
    // update classroom to classrooms dict
    dispatch(ClassroomsServices.actions.editClassroom(newClassroom));
  }

  async function submitForm() {
    if (!validateForm()) {
      return;
    }
    if (props.action === "create") {
      await createClassroom();
    } else if (props.action === "edit") {
      await editClassroom();
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
        disabled: loading,
      }}
      reset={() => {
        resetForm();
        terminateResponse();
      }}
    >
      <div className="create-classroom-form">
        <div className="ccf-layout-row">
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
              ariaLabel="classroom name"
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
        <div className="ccf-layout-row">
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

          <Textbox
            label="週堂數"
            errorMsg={creditError}
            mode="form"
            placeholder="請輸入教材名稱"
            value={credit}
            onChange={(e) => {
              if (
                /^\d+$/.test(e.currentTarget.value) ||
                e.currentTarget.value === ""
              ) {
                setCredit(e.currentTarget.value);
              }
            }}
            ariaLabel="credit"
          />
        </div>
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
            ariaLabel="other subject"
          />
        )}
      </div>
    </PopUp>
  );
};

export default ManageClassroomPU;
