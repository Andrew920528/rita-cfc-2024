import {useEffect} from "react";
import "./style/main.scss";
import {tryTrySee} from "./utils/service";

function App() {
  useEffect(() => {
    async function runRequest() {
      await tryTrySee();
    }
    runRequest();
  }, []);
  return <div className="App">Good Night Ojosama</div>;
}

export default App;
