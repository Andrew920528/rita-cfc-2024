import React, {useEffect, useState} from "react";
import IconButton from "../components/ui_components/IconButton";
import {Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../components/ui_components/Textbox";

/**
 * Notes for Ellen:
 * 1. To keep style consistent, use <Textbox> component, which is a wrapper around <input>
 * 2. Before we proceed with the data flow, let's look at the ui components
 * 3. Let's learn how to use (and read) custom components that I have not documented yet
 * 4. Now, let's change the css to make it look better
 */
const Login = () => {
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
  return (
    <div className="login-root">
      <div className="login-forming">
        <p className="--heading">登入</p>
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
        <IconButton
          mode={"primary"}
          flex={true}
          text="登入"
          icon={<LoginIcon />}
          onClick={() => {
            if (validateLogin()) {
              console.log("login Successful!");
              reset();
            }
          }}
        />
      </div>
      <div className="login-register">
        <p>尚未註冊？</p>
        <p
          className="login-create"
          onClick={() => {
            console.log("click");
          }}
        >
          建立帳號
        </p>
      </div>
    </div>
  );
};

export default Login;
