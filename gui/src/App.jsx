import {useEffect} from "react";
import "./App.css";
import {tryTrySee} from "./service";

function App() {
  useEffect(() => {
    async function runRequest() {
      await tryTrySee();
      console.log("after tts");
    }
    runRequest();
  }, []);
  return <div className="App">Good Night Ojosama</div>;
}

export default App;
