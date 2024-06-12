import React, {useEffect, useState} from "react";
import Textbox from "../ui_components/Textbox";
import IconButton from "../ui_components/IconButton";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {UserServices} from "../../features/UserSlice";

type ManageAccountPUProps = {};

const ManageAccountPU = (props: ManageAccountPUProps & PopUpProps) => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);

  // local states
  const [aliasError, setAliasError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [occupationError, setOccupationError] = useState("");

  const [alias, setAlias] = useState("");
  const [school, setSchool] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    setAlias(user.alias);
    setSchool(user.school);
    setOccupation(user.occupation);
  }, []);

  function resetForm() {
    setAlias("");
    setSchool("");
    setOccupation("");
    setAliasError("");
    setSchoolError("");
    setOccupationError("");
  }
  function validateAccount(): boolean {
    let validate = true;
    if (alias.trim() === "") {
      setAliasError("請輸入暱稱");
      validate = false;
    }
    if (school.trim() === "") {
      setSchoolError("請輸入學校");
      validate = false;
    }
    if (occupation.trim() === "") {
      setOccupationError("請輸入職稱");
      validate = false;
    }
    return validate;
  }

  function submitForm() {
    if (!validateAccount()) {
      return;
    }

    // update global states
    dispatch(UserServices.actions.setAlias(alias.trim()));
    dispatch(UserServices.actions.setSchool(school.trim()));
    dispatch(UserServices.actions.setOccupation(occupation.trim()));
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
      <div className="manage-account-form">
        <Textbox
          label="暱稱"
          errorMsg={aliasError}
          mode="form"
          placeholder="請輸入暱稱"
          value={alias}
          onChange={(e) => {
            setAlias(e.currentTarget.value);
          }}
          autoFocus={true}
        />
        <Textbox
          label="學校"
          errorMsg={schoolError}
          mode="form"
          placeholder="請輸入學校"
          value={school}
          onChange={(e) => {
            setSchool(e.currentTarget.value);
          }}
        />
        <Textbox
          label="職稱"
          errorMsg={occupationError}
          mode="form"
          placeholder="請輸入職稱"
          value={occupation}
          onChange={(e) => {
            setOccupation(e.currentTarget.value);
          }}
        />
      </div>
    </PopUp>
  );
};

export default ManageAccountPU;
