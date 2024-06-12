import {useEffect} from "react";
import "./style/main.scss";
import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";
function App() {
  return (
    <div className="App">
      <Login />
      {/* <Home /> */}
    </div>
  );
}

export default App;
