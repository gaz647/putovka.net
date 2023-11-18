import "./Login.css";
import { Link } from "react-router-dom";
import { loginRedux, setIsLoadingTrueRedux } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToastRedux } from "../redux/AuthSlice";
import isValidEmailFormat from "../customFunctionsAndHooks/isValidEmailFormat";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const toastRedux = useSelector((state) => state.auth.toast);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE STATE -----------------------------------------------------------
  //
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // HANDLE LOGIN --------------------------------------------------------
  //
  const handleLogIn = (e) => {
    e.preventDefault();

    const loginCredentials = { loginEmail, loginPassword };
    console.log("login SPUŠTĚN V Login.jsx");
    dispatch(loginRedux(loginCredentials));
    dispatch(setIsLoadingTrueRedux);
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = (e) => {
    e.preventDefault();
    setLoginEmail("");
    setLoginPassword("");
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isLoggedIn) {
      console.log("isLoggedIn je true, teď má přijít přesměrování");
      navigate("/login-success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (toastRedux.isVisible) {
      toastRedux.style === "success"
        ? toast.success(`${toastRedux.message}`)
        : toastRedux.style === "error"
        ? toast.error(`${toastRedux.message}`)
        : toastRedux.style === "warning"
        ? toast.warning(`${toastRedux.message}`)
        : null;
    }
  }, [toastRedux]);

  useEffect(() => {
    if (resetToastStateRedux) {
      setTimeout(() => {
        dispatch(resetToastRedux());
      }, 500);
    }
  }, [resetToastStateRedux, dispatch]);

  return (
    <section className="full-page-container-center">
      <ToastContainer
        transition={Flip}
        position="top-center"
        autoClose={toastRedux.time}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isLoading || isLoading2 ? (
        <>
          <Heading text={"Přihlašování . . ."} />
          <Spinner />
        </>
      ) : (
        <form className="change-form">
          <Heading text={"Přihlášení"} />

          <InputField
            type={"email"}
            label={"email"}
            value={loginEmail}
            onEmailChange={(e) => setLoginEmail(e)}
          />
          <InputField
            type={"password"}
            label={"heslo"}
            value={loginPassword}
            onPasswordChange={(e) => setLoginPassword(e)}
          />

          <ConfirmDeclineBtns
            disabled={
              !loginEmail || !loginPassword || !isValidEmailFormat(loginEmail)
            }
            confirmFunction={handleLogIn}
            declineFunction={handleDecline}
          />
          <br />
          <p className="login-register-bottom-link">
            Ještě nemáte účet? <Link to={"/register"}>Zaregistrujte se.</Link>
          </p>

          <p>
            Zapomenuté heslo?{" "}
            <Link to={"/forgotten-password"}>Klikněte zde.</Link>
          </p>
        </form>
      )}
    </section>
  );
};

export default Login;
