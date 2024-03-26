import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import TermsAndConditions from "./pages/TermsAndConditions";
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
import { useAppDispatch, useAppSelector } from "./redux/hooks";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  loginOnAuthRedux,
  logoutOnAuthRedux,
  logoutRedux,
  loadUserDataRedux,
  getInfoMessageRedux,
  getInfoMessagesRedux,
  setIsLoadingTrueRedux,
  setIsLoadingFalseRedux,
  runToastRedux,
} from "./redux/AuthSlice";
import DeleteAccount from "./pages/DeleteAccount";
import PersonalDataProcessing from "./pages/PersonalDataProcessing";

const App = () => {
  const dispatch = useAppDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoginPending = useAppSelector((state) => state.auth.isLoginPending);
  const isRegisterPending = useAppSelector(
    (state) => state.auth.isRegisterPending
  );
  const isAccountDeletingPending = useAppSelector(
    (state) => state.auth.isAccountDeletingPending
  );
  const infoMessage = useAppSelector((state) => state.auth.infoMessage);
  const infoMessages = useAppSelector((state) => state.auth.infoMessages);

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    console.log("App.tsx");
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
          dispatch(
            runToastRedux({
              message:
                "Vaše registrace není aktivní. Potvrďte ji kliknutím na odkaz který Vám byl odeslán do Vaší emalové schránky.",
              style: "error",
              time: false,
            })
          );
          setTimeout(() => {
            dispatch(logoutOnAuthRedux());
            dispatch(logoutRedux());
          }, 100);
        } else if (currentUser !== null && emailVerified) {
          console.log("karent jůsr není nul a potvrdil mail");
          if (user && user.email) {
            dispatch(loadUserDataRedux({ email: user.email, uid: user.uid }));
            dispatch(loginOnAuthRedux({ email: user.email, uid: user.uid }));
            dispatch(getInfoMessageRedux());
            dispatch(getInfoMessagesRedux());
          }
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
    console.log("INFO MESSAGES: ", infoMessages);
  }, [dispatch, infoMessage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route
          path="/personal-data-processing"
          element={<PersonalDataProcessing />}
        />

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
            <Route path="/settings" element={<Settings />} />
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
