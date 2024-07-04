import {useEffect, useRef, useState} from "react";
import "./style/main.scss";
// import {tryTrySee} from "./utils/service";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {useLoginParseState} from "./store/globalActions";
import {loginWithSidService, useApiHandler} from "./utils/service";
import {API} from "./global/constants";
import {useAppDispatch, useTypedSelector} from "./store/store";
import {LoginStatusServices} from "./features/LoginStatusSlice";
import LoginBuffer from "./pages/LoginBuffer/LoginBuffer";

function App() {
  const loginParseState = useLoginParseState();
  const {apiHandler} = useApiHandler();
  const loginStatus = useTypedSelector((state) => state.LoginStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("app rendered");
    async function loginWithSid() {
      // console.log(isMounted.current);
      const sid = sessionStorage.getItem("sessionId");
      if (!sid) return;
      // loginWithSid
      dispatch(LoginStatusServices.actions.setLoading(true));
      let r = await apiHandler({
        apiFunction: (s: AbortSignal) =>
          loginWithSidService(s, {
            sessionId: sid,
          }),
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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loginStatus.loading ? (
                <Navigate to="/redirecting" replace />
              ) : loginStatus.complete ? (
                <Home />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              loginStatus.loading ? (
                <Navigate to="/redirecting" replace />
              ) : loginStatus.complete ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/signup"
            element={
              loginStatus.loading ? (
                <Navigate to="/redirecting" replace />
              ) : loginStatus.complete ? (
                <Navigate to="/" replace />
              ) : (
                <SignUp />
              )
            }
          />
          <Route
            path="/redirecting"
            element={
              loginStatus.loading ? (
                <LoginBuffer />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
