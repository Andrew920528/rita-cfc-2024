import React, {useEffect, useState} from "react";
import IconButton from "../../components/ui_components/IconButton/IconButton";
import {Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../../components/ui_components/Textbox/Textbox";
import {Link, useNavigate} from "react-router-dom";
import {
  LoginResponseObject,
  loginService,
  useApiHandler,
} from "../../utils/service";
import {API_ERROR, EMPTY_ID} from "../../global/constants";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {UserServices} from "../../features/UserSlice";
import {ClassroomsServices} from "../../features/ClassroomsSlice";
import {LecturesServices} from "../../features/LectureSlice";
import {WidgetsServices} from "../../features/WidgetsSlice";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import {Chatroom, Chatrooms} from "../../schema/chatroom";
import {ChatroomsServices} from "../../features/ChatroomsSlice";

const cx = classNames.bind(styles);

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

    let classroomsDict = responseObj.classroomsDict;
    let classrooms = responseObj.user.classroomIds;
    for (let i = 0; i < classrooms.length; i++) {
      let cid = classrooms[i];
      classroomsDict[cid].lastOpenedLecture =
        classroomsDict[cid].lectureIds.length > 0
          ? classroomsDict[cid].lectureIds[0]
          : EMPTY_ID;

      let chatroomId = classroomsDict[cid].chatroom as string;
      dispatch(
        ChatroomsServices.actions.addChatroom({
          id: chatroomId,
          messages: [],
        })
      );
    }
    let currentClassroom =
      responseObj.user.classroomIds.length > 0
        ? responseObj.user.classroomIds[0]
        : EMPTY_ID;
    let currentChatroom =
      currentClassroom === EMPTY_ID
        ? EMPTY_ID
        : classroomsDict[currentClassroom].chatroom;

    dispatch(
      ClassroomsServices.actions.parseLogin({
        dict: classroomsDict,
        current: currentClassroom,
      })
    );

    dispatch(ChatroomsServices.actions.setCurrent(currentChatroom as string));

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
    if (
      currentLecture !== EMPTY_ID &&
      responseObj.lecturesDict[currentLecture].widgetIds.length > 0
    ) {
      currentWidget = responseObj.lecturesDict[currentLecture].widgetIds[0];
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
    <div className={cx("login-root")}>
      <div className={cx("login-forming")}>
        <p className={cx("--heading")}>登入</p>
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
      <div className={cx("login-register")}>
        <p>尚未註冊？</p>
        <Link to="/signup" className={cx("login-create")}>
          建立帳號
        </Link>
      </div>
    </div>
  );
};

export default Login;
