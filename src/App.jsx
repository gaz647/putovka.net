import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import AddJob from "./pages/AddJob";
import Archive from "./pages/Archive";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditJob from "./pages/EditJob";
import EditCustomJob from "./pages/EditCustomJob";
import EmailVerificationSent from "./pages/EmailVerificationSent";
import ForgottenPassword from "./pages/ForgottenPassword";
import ForgottenPasswordSent from "./pages/ForgottenPasswordSent";
import Error404 from "./pages/Error404";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import Test from "./pages/Test";
import SharedLayout from "./pages/SharedLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect } from "react";
import { auth } from "./firebase/config";
import { useDispatch } from "react-redux";
import {
  loginOnAuth,
  logoutOnAuth,
  setLoadingTrue,
  loadUserData,
  setLoadingFalse,
} from "./redux/AuthSlice";

const App = () => {
  // console.log("kokot", import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY);
  const dispatch = useDispatch();
  dispatch(setLoadingTrue());

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const lsEmailVerified = localStorage.getItem("emailVerified");

      if (lsEmailVerified === "true" && user) {
        try {
          console.log("lsEmailVerified NALEZEN v localStorage");
          console.log("loadUserData SPUŠTĚN dispatch v App.jsx");
          await dispatch(loadUserData(user.uid));
          console.log("loginOnAuth SPUŠTĚN dispatch v App.jsx");
          dispatch(loginOnAuth({ email: user.email, uid: user.uid }));
          console.log("setLoadingFalse SPUŠTĚN dispatch v App.jsx");
          dispatch(setLoadingFalse());
        } catch (error) {
          console.log(error.message);
          console.log(
            "setLoadingFalse SPUŠTĚN dispatch z catch(error) v App.jsx"
          );
          dispatch(setLoadingFalse());
        }
      } else {
        console.log("lsEmailVerified NE-NALEZEN v localStorage");
        console.log("logouthOnAuth SPUŠTĚN dispatch z else v App.jsx");
        dispatch(logoutOnAuth());
        console.log("setLoadingFalse SPUŠTĚN dispatch z else v App.jsx");
        dispatch(setLoadingFalse());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/email-verification-sent"
          element={<EmailVerificationSent />}
        />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route
          path="/forgotten-password-sent"
          element={<ForgottenPasswordSent />}
        />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/settings" lazy element={<Settings />} />
            <Route path="/change-email" element={<ChangeEmail />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/edit-job" element={<EditJob />} />
            <Route path="/edit-custom-job" element={<EditCustomJob />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
