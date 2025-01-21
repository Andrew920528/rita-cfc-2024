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
  Chinese: "",
  Mathematics: "",
  Other: "",
};

export const gradeDict = {
  "5th grade Term 1": "",
  "5th Grade Term 2": "",
  "6th Grade Term 1": "",
  "6th Grade Term 2": "",
};

export const publisherDict = {
  KNSH: "",
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
        setSubject("Other");
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
      setNameError("Enter classroom name");
      validate = false;
    } else if (
      new Set<string>(Object.values(classrooms.dict).map((c) => c.name)).has(
        name.trim()
      ) &&
      props.action === "create"
    ) {
      setNameError("Classroom name already exists");
      validate = false;
    }
    if (subject.trim() === "") {
      setSubjectError("Enter Subject");
      validate = false;
    }
    if (subject === "Other" && otherSubject.trim() === "") {
      setOtherSubjectError("Enter Subject");
      validate = false;
    }
    if (grade.trim() === "") {
      setGradeError("Select Grade");
      validate = false;
    }
    if (subject !== "Other" && publisher.trim() === "") {
      setPublisherError("Select Teaching Material");
      validate = false;
    }
    if (isNumeric(credit) === false || parseInt(credit) <= 0) {
      setCreditError("Enter Positive Integer");
      validate = false;
    }
    return validate;
  }

  async function submitForm() {
    if (!validateForm()) {
      return;
    }
    let sub = subject === "Other" ? otherSubject : subject;
    let pub = subject === "Other" ? "Comprehensive" : publisher;
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
        text: "Save Changes",
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
              label="Classroom Name"
              errorMsg={nameError}
              mode="form"
              placeholder="Enter classroom name"
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
              placeholder="Select Grade"
              flex={true}
              mode="form"
              errorMsg={gradeError}
              label="Grade"
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
            placeholder="Select Subject"
            flex={true}
            mode="form"
            errorMsg={subjectError}
            label="Subject"
          />

          <Textbox
            label="Weekly Sessions"
            errorMsg={creditError}
            mode="form"
            placeholder="Enter Teaching Material Name"
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
        {subject !== "Other" ? (
          <Dropdown
            currId={publisher}
            setCurrId={setPublisher}
            idDict={publisherDict}
            getName={(id) => {
              return id;
            }}
            placeholder="Select Teaching Material"
            flex={true}
            mode="form"
            errorMsg={publisherError}
            label="Teaching Material"
          />
        ) : (
          <Textbox
            label="Other Subjects"
            errorMsg={otherSubjectError}
            mode="form"
            placeholder="Enter Subject Name"
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
