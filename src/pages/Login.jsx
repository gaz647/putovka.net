import "./Login.css";
import { Link } from "react-router-dom";
import { loginRedux, setIsLoadingTrueRedux } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToastRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE SELECTORS
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const toastRedux = useSelector((state) => state.auth.toast);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // HANDLE LOGIN
  const handleLogIn = () => {
    const loginCredentials = { loginEmail, loginPassword };
    console.log("login SPUŠTĚN V Login.jsx");
    dispatch(loginRedux(loginCredentials));
    dispatch(setIsLoadingTrueRedux);
  };

  // HANDLE DECLINE
  const handleDecline = () => {
    setLoginEmail("");
    setLoginPassword("");
  };

  // USE EFFECTS
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
          <>
            <p>isLoading2</p>
            <Spinner2 />
          </>
        ) : (
          <form className="login-register-form">
            <h1 className="login-registerform-heading">Přihlášení</h1>
            <div className="login-register-form-item">
              <input
                className="login-register-form-input"
                type="email"
                placeholder="email"
                onChange={(e) => setLoginEmail(e.target.value)}
                value={loginEmail}
              />
            </div>
            <div className="login-register-form-item">
              <input
                className="login-register-form-input"
                type="password"
                placeholder="heslo"
                onChange={(e) => setLoginPassword(e.target.value)}
                value={loginPassword}
              />
            </div>

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
