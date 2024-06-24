import {useEffect, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {tryTrySee, useApiHandler} from "./utils/service";

function App() {
  const {apiHandler} = useApiHandler();
  useEffect(() => {
    async function runRequest() {
      let body = await apiHandler({apiFunction: (c) => tryTrySee(c)});
      console.log(body);

      return body;
    }
    runRequest();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
