import React, {useEffect, useState} from "react";

/**
 * Notes for Ellen:
 * 1. To keep style consistent, use <Textbox> component
 * 2. Before we proceed with the data flow, let's look at the ui components
 * 3. Let's add a button with <InputButton>, which is a wrapper around <button>
 * 4. Now, let's change the css to make it look better
 * 5. Finally, we will look at how to store input as states
 */
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
