import React, {useEffect, useState} from "react";
import IconButton from "../components/ui_components/IconButton";
import {Checkmark, Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../components/ui_components/Textbox";
import Login from "./Login";
import {Link, useNavigate} from "react-router-dom";
import {createUserService, useApiHandler} from "../utils/service";
import {API_ERROR} from "../utils/constants";
const SignUp = () => {
  //let navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const navigate = useNavigate();
  const {apiHandler, loading} = useApiHandler();
  function reset(): void {
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPassword("");
    setConfirmPasswordError("");
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
    if (confirmPassword.trim() == "") {
      setConfirmPasswordError("請輸入密碼");
      validate = false;
    }
    if (confirmPassword.trim() != password.trim()) {
      setConfirmPasswordError("密碼不匹配");
      setPasswordError("密碼不匹配");
      validate = false;
    }
    return validate;
  }

  async function signup() {
    if (!validateLogin()) return;

    let r = await apiHandler({
      apiFunction: (s) => createUserService(s, {username, password}),
      debug: true,
      identifier: "signup",
    });

    if (r.status === API_ERROR) {
      // failed to create user
      return;
    }

    reset();
    navigate("/login");
  }
  return (
    <div className="signup-root">
      <div className="signup-forming">
        <p className="--heading">建立帳號</p>
        <Textbox
          label="使用者名稱:"
          mode="form"
          flex={true}
          placeholder="輸入使用者名稱"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          errorMsg={usernameError}
        />
        <Textbox
          mode="form"
          flex={true}
          type="password"
          label="密碼"
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          errorMsg={passwordError}
        />
        <Textbox
          mode="form"
          flex={true}
          type="password"
          label="確認密碼"
          placeholder="輸入密碼"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.currentTarget.value);
          }}
          errorMsg={confirmPasswordError}
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
      <div className="signup-login">
        <p>已註冊？</p>

        <Link to="/login" className="signup-log">
          登入
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
