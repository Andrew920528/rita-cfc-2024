import React, {useEffect, useState} from "react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import Dropdown from "../../ui_components/Dropdown/Dropdown";
import {isNumeric, useCompose} from "../../../utils/util";

import {useApiHandler} from "../../../utils/service";
import classNames from "classnames/bind";
import styles from "./ManageClassroomPU.module.scss";
import {
  useCreateClassroomWithApi,
  useEditClassroomWithApi,
} from "../../../global/manageClassroomActions";

const cx = classNames.bind(styles);
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
  const [credit, setCredit] = useState("3");

  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [otherSubjectError, setOtherSubjectError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [publisherError, setPublisherError] = useState("");
  const [creditError, setCreditError] = useState("");
  const {isComposing, handleCompositionStart, handleCompositionEnd} =
    useCompose();
  // api handler
  const {apiHandler} = useApiHandler({
    runsInBackground: true,
  });
  const {createClassroom} = useCreateClassroomWithApi();
  const {editClassroom} = useEditClassroomWithApi();
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
    } else if (
      new Set<string>(Object.values(classrooms.dict).map((c) => c.name)).has(
        name.trim()
      ) &&
      props.action === "create"
    ) {
      setNameError("課堂名稱已存在");
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

  async function submitForm() {
    if (!validateForm()) {
      return;
    }
    let sub = subject === "其他" ? otherSubject : subject;
    let pub = subject === "其他" ? "綜合" : publisher;
    if (props.action === "create") {
      createClassroom({
        name: name,
        subject: sub,
        grade: grade,
        publisher: pub,
        credit: parseInt(credit),
      });
    } else if (props.action === "edit") {
      if (props.editClassroomId === undefined) {
        throw new Error("editClassroomId is undefined");
      }
      editClassroom({
        editClassroomId: props.editClassroomId,
        name: name,
        subject: sub,
        grade: grade,
        publisher: pub,
        credit: parseInt(credit),
      });
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
      puAction={() => {
        submitForm();
      }}
      reset={() => {
        resetForm();
      }}
      isComposing={isComposing}
    >
      <div className={cx("create-classroom-form")}>
        <div className={cx("ccf-layout-row")}>
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
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
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
        <div className={cx("ccf-layout-row")}>
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
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
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
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        )}
      </div>
    </PopUp>
  );
};

export default ManageClassroomPU;
