import "./Login.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerRedux, runToastRedux } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToastRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE SELECTORS
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isRegisterSuccess = useSelector(
    (state) => state.auth.isRegisterSuccess
  );
  const toastRedux = useSelector((state) => state.auth.toast);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE STATES
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPasword] = useState("");
  const [registerPassword2, setRegisterPasword2] = useState("");

  // HANDLE REGISTER
  const handleRegister = (e) => {
    e.preventDefault();
    if (registerPassword !== registerPassword2) {
      dispatch(
        runToastRedux({
          message: "Hesla se neshodují!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else {
      let registerCredentials = { registerEmail, registerPassword };
      dispatch(registerRedux(registerCredentials));
    }
  };

  // HANDLE DECLINE
  const handleDecline = () => {
    navigate("/");
  };

  // USE EFFECTS
  useEffect(() => {
    if (isRegisterSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage:
            "Email s odkazem pro potvrzení registrace byl úspěšně odeslán!",
          secondMessage: "Zkontrolujte Vaši emailovou schránku.",
        },
      });
    }
  }, [isRegisterSuccess, navigate]);

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
        {isLoading2 ? (
          <>
            <h1>Registrace probíhá</h1>
            <p>isLoading2</p>
            <Spinner2 />
          </>
        ) : (
          <form className="login-register-form">
            <h1 className="login-register-form-heading text-shadow">
              Registrace
            </h1>
            <div className="login-register-form-item">
              <input
                className="login-register-form-input"
                type="email"
                placeholder="email"
                onChange={(e) => setRegisterEmail(e.target.value)}
                value={registerEmail}
              />
            </div>

            <input
              className="login-register-form-input"
              type="password"
              placeholder="zadejte heslo"
              onChange={(e) => setRegisterPasword(e.target.value)}
              value={registerPassword}
            />
            <input
              className="login-register-form-input"
              type="password"
              placeholder="zadejte stejné heslo"
              onChange={(e) => setRegisterPasword2(e.target.value)}
              value={registerPassword2}
            />

            <ConfirmDeclineBtns
              confirmFunction={handleRegister}
              declineFunction={handleDecline}
            />

            <p>
              Již máte účet? <Link to={"/login"}>Přihlašte se.</Link>{" "}
            </p>
          </form>
        )}
      </section>
    </>
  );
};

export default Register;
