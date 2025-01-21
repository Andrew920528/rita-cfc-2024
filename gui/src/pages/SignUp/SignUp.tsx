import React, {useEffect, useState} from "react";
import IconButton from "../../components/ui_components/IconButton/IconButton";
import {Checkmark, Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../../components/ui_components/Textbox/Textbox";
import {Link, useNavigate} from "react-router-dom";
import {createUserService, useApiHandler} from "../../utils/service";
import {API, LANG} from "../../global/constants";
import classNames from "classnames/bind";
import styles from "./SignUp.module.scss";
import {initSchedule} from "../../schema/schedule";
import {toast} from "react-toastify";

const cx = classNames.bind(styles);
const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const navigate = useNavigate();
  const {apiHandler, loading} = useApiHandler();
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (loading) return;
        if (event.repeat) return;
        await signup();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [signup]);
  function reset(): void {
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPassword("");
    setConfirmPasswordError("");
  }

  function validateSignup(): boolean {
    let validate = true;
    // username cannot contain spaces

    if (username === "") {
      setUsernameError("請輸入使用者名稱");
      validate = false;
    } else if (username.includes(" ")) {
      setUsernameError("使用者名稱不能包含空格");
      validate = false;
    } else if (username.length < 8) {
      setUsernameError("使用者名稱至少8個字元");
      validate = false;
    } else if (username.length > 32) {
      setUsernameError("使用者名稱最多32個字元");
      validate = false;
    } else {
      setUsernameError("");
    }

    if (password === "") {
      setPasswordError("請輸入密碼");
      validate = false;
    } else if (password.includes(" ")) {
      setPasswordError("密碼不能包含空格");
      validate = false;
    } else if (password.length < 8) {
      setPasswordError("密碼至少8個字元");
      validate = false;
    } else if (password.length > 32) {
      setPasswordError("密碼最多32個字元");
      validate = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword.trim() == "") {
      setConfirmPasswordError("請輸入密碼");
      validate = false;
    } else if (confirmPassword.trim() != password.trim()) {
      setConfirmPasswordError("密碼不匹配");
      setPasswordError("密碼不匹配");
      validate = false;
    } else {
      setConfirmPasswordError("");
    }
    return validate;
  }

  async function signup() {
    if (!validateSignup()) return;

    const userPayload = {
      username,
      password,
      school: "",
      alias: username,
      occupation: "",
      schedule: JSON.stringify(initSchedule),
      lang: LANG.EN_US,
    };
    let r = await apiHandler({
      apiFunction: (s) => createUserService(userPayload, s),
      debug: true,
      identifier: "signup",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      // failed to create user
      if (r.data === "username existed") {
        setUsernameError("使用者名稱已存在");
      }
      return;
    }
    toast.success("註冊成功，請登入");
    reset();
    navigate("/login");
  }
  return (
    <div className={cx("signup-root")}>
      <div className={cx("signup-forming")}>
        <p className={cx("--heading")}>建立帳號</p>
        <Textbox
          label="使用者名稱:"
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
        <Textbox
          mode="form"
          flex={true}
          type="password"
          label="確認密碼"
          placeholder="輸入密碼"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.currentTarget.value.trim());
          }}
          errorMsg={confirmPasswordError}
          ariaLabel="confirm password"
        />
        <IconButton
          mode={"primary"}
          flex={true}
          text="建立帳號"
          icon={<Checkmark />}
          onClick={async () => {
            await signup();
          }}
          disabled={loading}
        />
      </div>
      <div className={cx("signup-login")}>
        <p>已註冊？</p>

        <Link to="/login" className={cx("signup-log")}>
          登入
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
