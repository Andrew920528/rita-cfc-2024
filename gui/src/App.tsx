import {useEffect, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App: React.FC = () => {
  // useEffect(() => {
  //   async function runRequest() {
  //     await tryTrySee();
  //   }
  //   runRequest();
  // }, []);

  return (
    <div className="App">
      {/* <Home /> */}
      <SignUp/>
    </div>
  );
};

export default App;
