import {useEffect, useState} from "react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {UserServices} from "../../../features/UserSlice";
import {updateUserService, useApiHandler} from "../../../utils/service";
import {API} from "../../../global/constants";
import classNames from "classnames/bind";
import styles from "./ManageAccountPU.module.scss";
import {useCompose} from "../../../utils/util";
import {toast} from "react-toastify";

const cx = classNames.bind(styles);
type ManageAccountPUProps = {};

const ManageAccountPU = (props: ManageAccountPUProps & PopUpProps) => {
  // global states
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const {apiHandler, loading, terminateResponse} = useApiHandler();

  // local states
  const [aliasError, setAliasError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [occupationError, setOccupationError] = useState("");

  const [alias, setAlias] = useState("");
  const [school, setSchool] = useState("");
  const [occupation, setOccupation] = useState("");
  const {isComposing, handleCompositionStart, handleCompositionEnd} =
    useCompose();
  useEffect(() => {
    setAlias(user.alias);
    setSchool(user.school);
    setOccupation(user.occupation);
  }, [props.trigger]);

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

  async function submitForm() {
    if (!validateAccount()) {
      return;
    }
    let r = await apiHandler({
      apiFunction: (s) =>
        updateUserService(
          {
            alias: alias.trim(),
            school: school.trim(),
            occupation: occupation.trim(),
          },
          s
        ),
      debug: true,
      identifier: "updateUserService",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("存檔失敗，請重試");
      return;
    }

    // update global states
    dispatch(
      UserServices.actions.setProfile({
        alias: alias.trim(),
        school: school.trim(),
        occupation: occupation.trim(),
      })
    );

    props.setTrigger(false);
  }

  return (
    <PopUp
      {...props}
      footerBtnProps={{
        icon: <Save size={20} />,
        text: "儲存變更",
        disabled: loading,
      }}
      reset={() => {
        terminateResponse();
      }}
      puAction={() => {
        submitForm();
      }}
      isComposing={isComposing}
    >
      <div className={cx("manage-account-form")}>
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
          ariaLabel="alias"
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
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
          ariaLabel="school"
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
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
          ariaLabel="occupation"
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>
    </PopUp>
  );
};

export default ManageAccountPU;
