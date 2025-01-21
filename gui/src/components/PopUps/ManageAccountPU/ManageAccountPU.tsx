import {useEffect, useState} from "react";
import Textbox from "../../ui_components/Textbox/Textbox";
import {Save} from "@carbon/icons-react";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {UserServices} from "../../../features/UserSlice";
import {updateUserService, useApiHandler} from "../../../utils/service";
import {API, LANG} from "../../../global/constants";
import classNames from "classnames/bind";
import styles from "./ManageAccountPU.module.scss";
import {getEnumKeyByValue, useCompose} from "../../../utils/util";
import {toast} from "react-toastify";
import Dropdown from "../../ui_components/Dropdown/Dropdown";

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

  const [lang, setLang] = useState<string>(getEnumKeyByValue(LANG, user.lang));

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
      setAliasError("Enter Nickname");
      validate = false;
    }
    if (school.trim() === "") {
      setSchoolError("Enter School Name");
      validate = false;
    }
    if (occupation.trim() === "") {
      setOccupationError("Enter Job Title");
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
            lang: LANG[lang as keyof typeof LANG],
          },
          s
        ),
      debug: true,
      identifier: "updateUserService",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      toast.error("Save failed, please try again");
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
    dispatch(UserServices.actions.setLang(LANG[lang as keyof typeof LANG]));

    props.setTrigger(false);
  }

  return (
    <PopUp
      {...props}
      footerBtnProps={{
        icon: <Save size={20} />,
        text: "Save Changes",
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
          label="Nickname"
          errorMsg={aliasError}
          mode="form"
          placeholder="Enter Nickname"
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
          label="School"
          errorMsg={schoolError}
          mode="form"
          placeholder="Enter School Name"
          value={school}
          onChange={(e) => {
            setSchool(e.currentTarget.value);
          }}
          ariaLabel="school"
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <Textbox
          label="Job Title"
          errorMsg={occupationError}
          mode="form"
          placeholder="Enter Job Title"
          value={occupation}
          onChange={(e) => {
            setOccupation(e.currentTarget.value);
          }}
          ariaLabel="occupation"
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <div>
          <Dropdown
            currId={lang}
            setCurrId={setLang}
            idDict={LANG}
            getName={(id) => {
              return LANG[id as keyof typeof LANG];
            }}
            placeholder=""
            flex={true}
            mode="form"
            label="Language"
          />
        </div>
      </div>
    </PopUp>
  );
};

export default ManageAccountPU;
