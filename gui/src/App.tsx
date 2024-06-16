import {useEffect, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ReactDOM from "react-dom/client";

// useEffect(() => {
//   async function runRequest() {
//     await tryTrySee();
//   }
//   runRequest();
// }, []);

function App() {
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
