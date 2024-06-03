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
  return (
    <div className="App">
      Good Night Ojosama
      <h4>
        <strong>筆記This is h4 with strong, font size = 20</strong>
      </h4>
      <p>This is a p, font size = 16</p>
      <div>This is a div, font size = 14</div>
      <div className="--label">Some text</div>
      <div className="--heading">新科目 Hello</div>
      <div>新科目 Hello</div>
    </div>
  );
}

export default App;
