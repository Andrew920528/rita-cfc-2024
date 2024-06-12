import React, {useEffect, useState} from "react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className="login-root">
      <h2>Login</h2>
      <div className="login-root">
        <form>
          Username:
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input type="text" id="password" value={password} />
        </form>
      </div>
    </div>
  );
};

export default Login;
