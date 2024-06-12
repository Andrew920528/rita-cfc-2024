import React, {useState} from "react";
import Textbox from "../ui_components/Textbox";
import IconButton from "../ui_components/IconButton";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "./PopUp";

type ManageAccountPUProps = {};

const ManageAccountPU = (props: ManageAccountPUProps & PopUpProps) => {
  const [aliasError, setAliasError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [occupationError, setOccupationError] = useState("");

  const [alias, setAlias] = useState("");
  const [school, setSchool] = useState("");
  const [occupation, setOccupation] = useState("");

  function resetForm() {
    setAlias("");
    setSchool("");
    setOccupation("");
    setAliasError("");
    setSchoolError("");
    setOccupationError("");
  }
  function validateAccount() {
    if (alias === "") {
      setAliasError("請輸入暱稱");
    } else {
      setAliasError("");
    }
    if (school === "") {
      setSchoolError("請輸入學校");
    } else {
      setSchoolError("");
    }
    if (occupation === "") {
      setOccupationError("請輸入職稱");
    } else {
      setOccupationError("");
    }

    // calls api
    // close panel
  }

  return (
    <PopUp
      {...props}
      footerBtnProps={{
        icon: <Save size={20} />,
        text: "儲存變更",
        onClick: () => {
          validateAccount();
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
