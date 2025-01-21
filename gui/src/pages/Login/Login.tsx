import {useEffect, useState} from "react";
import IconButton from "../../components/ui_components/IconButton/IconButton";
import {Login as LoginIcon} from "@carbon/icons-react";
import Textbox from "../../components/ui_components/Textbox/Textbox";
import {Link} from "react-router-dom";
import {loginService, useApiHandler} from "../../utils/service";
import {API} from "../../global/constants";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import {useLoginParseState} from "../../global/globalActions";
import {LoginStatusServices} from "../../features/LoginStatusSlice";
import {TText} from "../../components/TText/TText";

const cx = classNames.bind(styles);

const Login = () => {
  const {apiHandler, loading} = useApiHandler();
  const dispatch = useAppDispatch();
  const loginParseState = useLoginParseState();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (loading) return;
        if (event.repeat) return;
        await login();
      }
    };
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [login]);

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
      apiFunction: (s) =>
        loginService({username: username, password: password}, s),
      debug: true,
      identifier: "login",
    });

    if (r.status === API.ERROR || r.status === API.ABORTED) {
      if (r.data === "Username or password is incorrect. Please try again.") {
        setUsernameError("使用者名稱或密碼錯誤");
        setPasswordError("使用者名稱或密碼錯誤");
      }
      return;
    }
    loginParseState(r.data);
    reset();
    dispatch(LoginStatusServices.actions.setComplete(true));
  }
  return (
    <div className={cx("login-root")}>
      <div className={cx("login-forming")}>
        <p className={cx("--heading")}>
          <TText>登入</TText>
        </p>
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
          }}
          disabled={loading}
        />
      </div>
      <div className={cx("login-register")}>
        <p>
          <TText>尚未註冊？</TText>
        </p>
        <Link to="/signup" className={cx("login-create")}>
          <TText>建立帳號</TText>
        </Link>
      </div>
    </div>
  );
};

export default Login;
