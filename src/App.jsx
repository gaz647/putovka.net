import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import AddJob from "./pages/AddJob";
import Archive from "./pages/Archive";
import EditArchiveMonthSummarySettings from "./pages/EditArchiveMonthSummarySettings";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import LoginSuccess from "./components/LoginSuccess";
import Register from "./pages/Register";
import EditJob from "./pages/EditJob";
import ForgottenPassword from "./pages/ForgottenPassword";
import Error404 from "./pages/Error404";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import ChangeVerification from "./components/ChangeVerification";
import SharedLayout from "./pages/SharedLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect } from "react";
import { auth } from "./firebase/config";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  loginOnAuthRedux,
  logoutOnAuthRedux,
  logoutRedux,
  loadUserDataRedux,
  getInfoMessageRedux,
  setIsLoadingTrueRedux,
  setIsLoadingFalseRedux,
  runToastRedux,
} from "./redux/AuthSlice";
import DeleteAccount from "./pages/DeleteAccount";

const App = () => {
  const dispatch = useDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoginPending = useSelector((state) => state.auth.isLoginPending);
  const isRegisterPending = useSelector(
    (state) => state.auth.isRegisterPending
  );
  const isAccountDeletingPending = useSelector(
    (state) => state.auth.isAccountDeletingPending
  );
  const infoMessage = useSelector((state) => state.auth.infoMessage);

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    console.log("App.jsx");
    console.log(
      "!isLoginPending || !isAccountDeletingPending || !isRegisterPending ==> spuštěno"
    );

    if (!isLoginPending && !isAccountDeletingPending && !isRegisterPending) {
      console.log("SPUŠTĚN ON AUTH STATE CHANGED");
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        console.log("auth status se změnil");
        dispatch(setIsLoadingTrueRedux());

        const currentUser = auth.currentUser;
        let emailVerified;

        if (currentUser !== null) {
          emailVerified = currentUser.emailVerified;
        }

        if (currentUser === null) {
          console.log("karent jůsr je nul");
          dispatch(setIsLoadingFalseRedux());
        } else if (currentUser !== null && !emailVerified) {
          console.log("karent jůsr není nul ale nepotvrdil email");
          console.log("proto ho odhlašuji");
          dispatch(logoutOnAuthRedux());
          dispatch(logoutRedux());
        } else if (currentUser !== null && emailVerified) {
          console.log("karent jůsr není nul a potvrdil mail");

          dispatch(loadUserDataRedux({ email: user.email, uid: user.uid }));
          dispatch(loginOnAuthRedux({ email: user.email, uid: user.uid }));
          dispatch(getInfoMessageRedux());
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, isAccountDeletingPending, isLoginPending, isRegisterPending]);

  useEffect(() => {
    //  RUN MESSAGE
    //
    const lsInfoMessage = localStorage.getItem("infoMessage");

    if (infoMessage !== null && infoMessage !== "") {
      if (lsInfoMessage === null || infoMessage !== lsInfoMessage) {
        console.log("infoMessage", infoMessage, "lsInfoMessage", lsInfoMessage);
        console.log("teď má vyjet toast");
        dispatch(
          runToastRedux({
            message: infoMessage,
            style: "warning",
            time: false,
          })
        );
        localStorage.setItem("infoMessage", infoMessage);
      }
    }
  }, [dispatch, infoMessage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgotten-password" element={<ForgottenPassword />} />

        <Route path="/change-verification" element={<ChangeVerification />} />

        <Route path="/login-success" element={<LoginSuccess />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/archive" element={<Archive />} />
            <Route
              path="/edit-archive-month-summary-settings"
              element={<EditArchiveMonthSummarySettings />}
            />
            <Route path="/settings" lazy element={<Settings />} />
            <Route path="/change-email" element={<ChangeEmail />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/edit-job" element={<EditJob />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
