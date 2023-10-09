import "./Login.css";
import { Link } from "react-router-dom";
import { loginRedux, setIsLoadingTrueRedux } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToastRedux } from "../redux/AuthSlice";
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
  const handleLogIn = () => {
    const loginCredentials = { loginEmail, loginPassword };
    console.log("login SPUŠTĚN V Login.jsx");
    dispatch(loginRedux(loginCredentials));
    dispatch(setIsLoadingTrueRedux);
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
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
      console.log("toast SPUŠTĚN");
      toastRedux.style === "success"
        ? toast.success(`${toastRedux.message}`)
        : toastRedux.style === "error"
        ? toast.error(`${toastRedux.message}`)
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
    <>
      <section className="login-register">
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
          <div className="full-page-container-center">
            <Heading text={"Přihlašování . . ."} />
            <p>isLoading2</p>
            <Spinner />
          </div>
        ) : (
          <form className="login-register-form">
            <Heading text={"Přihlášení"} />

            <InputField
              type={"email"}
              label={"email"}
              onEmailChange={(e) => setLoginEmail(e)}
            />
            <InputField
              type={"password"}
              label={"heslo"}
              onPasswordChange={(e) => setLoginPassword(e)}
            />

            <ConfirmDeclineBtns
              confirmFunction={handleLogIn}
              declineFunction={handleDecline}
            />

            <p>
              Ještě nemáte účet? <Link to={"/register"}>Zaregistrujte se.</Link>
            </p>

            <p>
              Zapomenuté heslo?{" "}
              <Link to={"/forgotten-password"}>Klikněte zde.</Link>
            </p>
          </form>
        )}
      </section>
    </>
  );
};

export default Login;
