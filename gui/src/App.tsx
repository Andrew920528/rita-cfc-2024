import {useEffect, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";

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
      <Login />
    </div>
  );
};

export default App;
