import {useEffect} from "react";
import "./style/main.scss";
import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";
function App() {
  // useEffect(() => {
  //   async function runRequest() {
  //     await tryTrySee();
  //   }
  //   runRequest();
  // }, []); <Login></Login> <Home></Home> 
  return (
    <div className="App">
      <Login></Login> 
      
    </div>
  );
}

export default App;
