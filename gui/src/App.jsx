import {useEffect} from "react";
import "./style/main.scss";
import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
function App() {
  useEffect(() => {
    async function runRequest() {
      await tryTrySee();
    }
    runRequest();
  }, []);
  return (
    <div className="App">
      <Home></Home>
    </div>
  );
}

export default App;
