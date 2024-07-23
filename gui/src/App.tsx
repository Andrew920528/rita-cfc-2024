import {ReactNode, useEffect, useRef, useState} from "react";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useLoginParseState} from "./global/globalActions";
import {
  loginWithSidService,
  setUpRitaService,
  useApiHandler,
} from "./utils/service";
import {API} from "./global/constants";
import {useAppDispatch, useTypedSelector} from "./store/store";
import {LoginStatusServices} from "./features/LoginStatusSlice";
import Redirect from "./pages/Redirect/Redirect";
import {overrideConsoleWarning} from "./utils/util";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/main.scss";
import FileDownload from "./components/widgets/WorksheetWidget/FileDownload";
import PdfPreview from "./components/widgets/WorksheetWidget/PdfPreview";
overrideConsoleWarning("https://reactflow.dev/error#002"); // weird react flow warning that's irrelevant

function App() {
  const loginParseState = useLoginParseState();
  const {apiHandler} = useApiHandler();
  const {apiHandler: initRitaHandler} = useApiHandler();
  const loginStatus = useTypedSelector((state) => state.LoginStatus);
  const dispatch = useAppDispatch();
  const runOnce = useRef<boolean>(false);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    async function initRita() {
      initRitaHandler({
        apiFunction: () => setUpRitaService(),
        debug: true,
        identifier: "setupRita",
      });
    }
    initRita();
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
        toast.error("您已被自動登出，請重新登入");
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
      <FileDownload />
      <PdfPreview />
      <ToastContainer theme="light" />
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
