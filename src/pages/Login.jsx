import "./Login.css";
import { Link } from "react-router-dom";
import { loginRedux } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToast } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAccountDeleted = useSelector((state) => state.auth.isAccountDeleted);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogIn = () => {
    const loginCredentials = { loginEmail, loginPassword };
    console.log("login SPUŠTĚN V Login.jsx");
    dispatch(loginRedux(loginCredentials));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const toastRedux = useSelector((state) => state.auth.toast);

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

  const resetToastRedux = useSelector((state) => state.auth.toast.resetToast);

  useEffect(() => {
    if (resetToastRedux) {
      setTimeout(() => {
        dispatch(resetToast());
      }, 500);
    }
  }, [resetToastRedux, dispatch]);

  const handleDecline = () => {
    setLoginEmail("");
    setLoginPassword("");
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
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
          <form className="login-register-form">
            {isAccountDeleted && (
              <h1 className="leaving-message">Bylo mi ctí sloužit!</h1>
            )}
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
        </section>
      )}
    </>
  );
};

export default Login;
