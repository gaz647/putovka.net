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
  loadUserDataRedux,
} from "./redux/AuthSlice";
import DeleteAccount from "./pages/DeleteAccount";

const App = () => {
  const dispatch = useDispatch();

  const isLoginPending = useSelector((state) => state.auth.isLoginPending);

  useEffect(() => {
    if (!isLoginPending) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        const lsEmailVerified = localStorage.getItem("emailVerified");

        if (lsEmailVerified === "true" && user) {
          try {
            console.log("App.jsx");
            console.log("lsEmailVerified NA-LEZEN");
            console.log("loadUserDataRedux SPUŠTĚN dispatch v App.jsx");
            dispatch(loadUserDataRedux(user.uid));
            console.log("loginOnAuthRedux SPUŠTĚN dispatch v App.jsx");
            dispatch(loginOnAuthRedux({ email: user.email, uid: user.uid }));
          } catch (error) {
            console.log(error.message);
          }
        } else {
          console.log("lsEmailVerified NE-NALEZEN v localStorage");
          console.log("logoutOnAuthRedux SPUŠTĚN dispatch z else v App.jsx");
          dispatch(logoutOnAuthRedux());
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, isLoginPending]);

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
