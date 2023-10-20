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
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isRegisterSuccess = useSelector(
    (state) => state.auth.isRegisterSuccess
  );
  const toastRedux = useSelector((state) => state.auth.toast);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE STATE -----------------------------------------------------------
  //
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword1, setRegisterPasword1] = useState("");
  const [registerPassword2, setRegisterPasword2] = useState("");

  // HANDLE REGISTER -----------------------------------------------------
  //
  const handleRegister = (e) => {
    e.preventDefault();
    if (registerPassword1 !== registerPassword2) {
      dispatch(
        runToastRedux({
          message: "Hesla se neshodují!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else {
      let registerCredentials = { registerEmail, registerPassword1 };
      dispatch(registerRedux(registerCredentials));
    }
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/");
  };

  // USE EFFECT ----------------------------------------------------------
  //
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
          <div className="full-page-container-center">
            <Heading text={"Registrace probíhá . . ."} />
            <Spinner />
          </div>
        ) : (
          <form className="login-register-form">
            <Heading text={"Registrace"} />

            <InputField
              type={"email"}
              label={"nový email"}
              onEmailChange={(e) => setRegisterEmail(e)}
            />
            <InputField
              type={"password"}
              label={"heslo"}
              onPasswordChange={(e) => setRegisterPasword1(e)}
            />
            <InputField
              type={"password"}
              label={"heslo znovu"}
              onPasswordChange={(e) => setRegisterPasword2(e)}
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
