import {ReactNode, useEffect, useRef, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useLoginParseState} from "./global/globalActions";
import {loginWithSidService, useApiHandler} from "./utils/service";
import {API} from "./global/constants";
import {useAppDispatch, useTypedSelector} from "./store/store";
import {LoginStatusServices} from "./features/LoginStatusSlice";
import Redirect from "./pages/Redirect/Redirect";
import {overrideConsoleWarning} from "./utils/util";
import {c} from "vite/dist/node/types.d-aGj9QkWt";

overrideConsoleWarning("https://reactflow.dev/error#002"); // weird react flow warning that doesn't apply here

function App() {
  const loginParseState = useLoginParseState();
  const {apiHandler} = useApiHandler();
  const loginStatus = useTypedSelector((state) => state.LoginStatus);
  const dispatch = useAppDispatch();
  const [streamData, setStreamData] = useState("");
  const runOnce = useRef<boolean>(false);
  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    async function streamGetter() {
      const BASE_URL_DEV = "http://127.0.0.1:5000";

      const endPointSetup = "/setup-rita"
      const responseSetup = await fetch(BASE_URL_DEV + endPointSetup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Convert data object to JSON string
      });

      const endPoint = "/message-rita";
      const response = await fetch(BASE_URL_DEV + endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "prompt": "幫我刪除第三周然後把第二周的教材改成2-1",
          "widget": {
           "id": 1,
           "type": 0,
           "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}]
        }
          },
          "lectureId": 1,
          "classroomId": 1
        }), // Convert data object to JSON string
      });
      const reader = response.body?.getReader();
      let result = "";
      const decoder = new TextDecoder();
      let chunks = [];
      while (true) {
        const {done, value} = await reader!.read();
        if (done) break;
        let newVal = decoder.decode(value);
        result += newVal;
        setStreamData(result);
        chunks.push(newVal);
      }
      console.log(chunks);
    }
    streamGetter();
  }, []);

  useEffect(() => {
    async function loginWithSid() {
      const sid = sessionStorage.getItem("sessionId");
      if (!sid) return;
      // loginWithSid
      dispatch(LoginStatusServices.actions.setLoading(true));
      let r = await apiHandler({
        apiFunction: (s) =>
          loginWithSidService(
            {
              sessionId: sid,
            },
            s
          ),
        debug: true,
        identifier: "login with sid",
      });

      if (r.status === API.ABORTED) {
        // In this scenario, abort is only possible when page is refreshed,
        // therefore we'll rely on next render to set loading status
        // This is to deal with strict mode, and is unlikely to happen in practice
        return;
      }
      if (r.status === API.ERROR) {
        // if an error actually occurs, we need to navigate to the login page
        // TODO Toast automatic login failed
        dispatch(LoginStatusServices.actions.setLoading(false));
        return;
      }

      loginParseState(r.data);
      dispatch(LoginStatusServices.actions.setLoading(false));
      dispatch(LoginStatusServices.actions.setComplete(true));
    }

    if (sessionStorage.getItem("sessionId")) {
      loginWithSid();
    }
  }, []);
  return (
    <div className="App">
      <div>{streamData}</div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={RouteHandler({
              element: <Home />,
              rule: "after-login",
            })}
          />
          <Route
            path="/login"
            element={RouteHandler({
              element: <Login />,
              rule: "before-login",
            })}
          />
          <Route
            path="/signup"
            element={RouteHandler({
              element: <SignUp />,
              rule: "before-login",
            })}
          />

          <Route
            path="/redirecting"
            element={
              loginStatus.loading ? <Redirect /> : <Navigate to="/" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

type RouteProps = {
  element: ReactNode;
  rule: "after-login" | "before-login";
};
const RouteHandler = ({element, rule}: RouteProps) => {
  const loginStatus = useTypedSelector((state) => state.LoginStatus);

  if (rule === "before-login") {
    if (loginStatus.loading) {
      return <Navigate to="/redirecting" replace />;
    } else {
      if (loginStatus.complete) {
        return <Navigate to="/" replace />;
      } else {
        return element;
      }
    }
  } else if (rule === "after-login") {
    if (loginStatus.loading) {
      return <Navigate to="/redirecting" replace />;
    } else {
      if (loginStatus.complete) {
        return element;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }
};

export default App;
