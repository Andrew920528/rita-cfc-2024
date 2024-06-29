import React, {useEffect, useState} from "react";
import IconButton from "../components/ui_components/IconButton/IconButton";
import {Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../components/ui_components/Textbox";
import {Link, useNavigate} from "react-router-dom";
import {
  LoginResponseObject,
  loginService,
  useApiHandler,
} from "../utils/service";
import {API_ERROR, EMPTY_ID} from "../utils/constants";
import {useAppDispatch} from "../store/store";
import {UserServices} from "../features/UserSlice";
import {ClassroomsServices} from "../features/ClassroomsSlice";
import {LecturesServices} from "../features/LectureSlice";
import {WidgetsServices} from "../features/WidgetsSlice";
/**
 * Notes for Ellen:
 * 1. To keep style consistent, use <Textbox> component, which is a wrapper around <input>
 * 2. Before we proceed with the data flow, let's look at the ui components
 * 3. Let's learn how to use (and read) custom components that I have not documented yet
 * 4. Now, let's change the css to make it look better
 */
const Login = () => {
  const {apiHandler, loading} = useApiHandler();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  function reset(): void {
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
  }

  function validateLogin(): boolean {
    let validate = true;
    if (username.trim() === "") {
      setUsernameError("請輸入使用者名稱");
      validate = false;
    }
    if (password.trim() === "") {
      setPasswordError("請輸入密碼");
      validate = false;
    }
    return validate;
  }
  async function login() {
    if (!validateLogin()) return;
    let r = await apiHandler({
      apiFunction: (s) => loginService(s, {username, password}),
      debug: true,
      identifier: "login",
    });

    if (r.status === API_ERROR) {
      // TODO error toast
      return;
    }
    // parse to global state
    // TODO: set token @iteration 2
    let responseObj = r.data as LoginResponseObject;
    dispatch(UserServices.actions.parseLogin(responseObj.user));
    console.log(
      responseObj.user.classrooms.length > 0
        ? responseObj.user.classrooms[0]
        : EMPTY_ID
    );

    let classroomsDict = responseObj.classroomsDict;
    let classrooms = responseObj.user.classrooms;
    for (let i = 0; i < classrooms.length; i++) {
      let cid = classrooms[i];
      classroomsDict[cid].lastOpenedLecture =
        classroomsDict[cid].lectures.length > 0
          ? classroomsDict[cid].lectures[0]
          : EMPTY_ID;
    }
    let currentClassroom =
      responseObj.user.classrooms.length > 0
        ? responseObj.user.classrooms[0]
        : EMPTY_ID;
    dispatch(
      ClassroomsServices.actions.parseLogin({
        dict: classroomsDict,
        current: currentClassroom,
      })
    );

    let currentLecture = EMPTY_ID;
    if (currentClassroom !== EMPTY_ID) {
      currentLecture = classroomsDict[currentClassroom]
        .lastOpenedLecture as string;
    }

    dispatch(
      LecturesServices.actions.parseLogin({
        dict: responseObj.lecturesDict,
        current: currentLecture,
      })
    );

    let currentWidget = EMPTY_ID;
    if (currentLecture !== EMPTY_ID) {
      currentWidget = responseObj.lecturesDict[currentLecture].widgets[0];
    }
    dispatch(
      WidgetsServices.actions.parseLogin({
        dict: responseObj.widgetDict,
        current: currentWidget,
      })
    );

    reset();
    navigate("/");
  }
  return (
    <div className="login-root">
      <div className="login-forming">
        <p className="--heading">登入</p>
        <Textbox
          label="使用者名稱"
          mode="form"
          flex={true}
          placeholder="輸入使用者名稱"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value.trim());
          }}
          errorMsg={usernameError}
          ariaLabel="username"
        />
        <Textbox
          mode="form"
          flex={true}
          type="password"
          label="密碼"
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value.trim());
          }}
          errorMsg={passwordError}
          ariaLabel="password"
        />
        <IconButton
          mode={"primary"}
          flex={true}
          text="登入"
          icon={<LoginIcon />}
          onClick={async () => {
            await login();
            // console.log("log in called");
          }}
          disabled={loading}
        />
      </div>
      <div className="login-register">
        <p>尚未註冊？</p>
        <Link to="/signup" className="login-create">
          建立帳號
        </Link>
      </div>
    </div>
  );
};

export default Login;
