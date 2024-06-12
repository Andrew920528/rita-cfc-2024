import {useEffect, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";

const App: React.FC = () => {
  // useEffect(() => {
  //   async function runRequest() {
  //     await tryTrySee();
  //   }
  //   runRequest();
  // }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
