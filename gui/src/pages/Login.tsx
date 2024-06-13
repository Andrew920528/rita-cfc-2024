import React, {useEffect, useState} from "react";
import IconButton from "../components/ui_components/IconButton";
import { Exit } from "@carbon/icons-react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className="login-root">
      <h2><strong>登入</strong></h2>
      <div className="login-material">
        <div className="Forming">
          <label className="usrn">
            <h5>使用者名稱:</h5>
            <input
              type="text"
              id="username"
              value={username}
              className="input_box"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="chldn">
            <h5>密碼:</h5>
            <input
              type="password" // Changed type to password for privacy
              id="password"
              value={password}
              className="input_box"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="login-button">
            <IconButton mode={"ghost"} icon={<Exit />} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
