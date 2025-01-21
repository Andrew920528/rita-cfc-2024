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
import {TText} from "../../components/TText/TText";

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
      setUsernameError("Please Enter Username");
      validate = false;
    } else if (username.includes(" ")) {
      setUsernameError("Username Cannot Contain Spaces");
      validate = false;
    } else if (username.length < 8) {
      setUsernameError("Username At Least8Characters");
      validate = false;
    } else if (username.length > 32) {
      setUsernameError("Username At Most32Characters");
      validate = false;
    } else {
      setUsernameError("");
    }

    if (password === "") {
      setPasswordError("Please Enter Password");
      validate = false;
    } else if (password.includes(" ")) {
      setPasswordError("Password Cannot Contain Spaces");
      validate = false;
    } else if (password.length < 8) {
      setPasswordError("Password At Least8Characters");
      validate = false;
    } else if (password.length > 32) {
      setPasswordError("Password At Most32Characters");
      validate = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword.trim() == "") {
      setConfirmPasswordError("Please Enter Password");
      validate = false;
    } else if (confirmPassword.trim() != password.trim()) {
      setConfirmPasswordError("Passwords Do Not Match");
      setPasswordError("Passwords Do Not Match");
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
        setUsernameError("Username Already Exists");
      }
      return;
    }
    toast.success("Registration successful, please log in");
    reset();
    navigate("/login");
  }
  return (
    <div className={cx("signup-root")}>
      <div className={cx("signup-forming")}>
        <p className={cx("--heading")}>
          <TText>Create Account</TText>
        </p>
        <Textbox
          label="User:"
          mode="form"
          flex={true}
          placeholder="Enter Username"
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
          label="Password"
          placeholder="Enter Password"
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
          label="Confirm Password"
          placeholder="Enter Password"
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
          text="Create Account"
          icon={<Checkmark />}
          onClick={async () => {
            await signup();
          }}
          disabled={loading}
        />
      </div>
      <div className={cx("signup-login")}>
        <p>
          <TText>Registered?</TText>
        </p>

        <Link to="/login" className={cx("signup-log")}>
          <TText>Log In</TText>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
