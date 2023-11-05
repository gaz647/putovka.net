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
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isRegisterReduxSuccess = useSelector(
    (state) => state.auth.isRegisterReduxSuccess
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
    navigate("/login");
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isRegisterReduxSuccess) {
      console.log("dobže");
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage:
            "Email s odkazem pro potvrzení registrace byl úspěšně odeslán!",
          secondMessage: "Zkontrolujte Vaši emailovou schránku.",
        },
      });
    }
  }, [isRegisterReduxSuccess, navigate]);

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
          <Heading text={"Registrace probíhá . . ."} />
          <Spinner />
        </>
      ) : (
        <form className="change-form">
          <Heading text={"Registrace"} />

          <InputField
            type={"email"}
            label={"nový email"}
            value={registerEmail}
            onEmailChange={(e) => setRegisterEmail(e)}
          />
          <InputField
            type={"password"}
            label={"heslo"}
            value={registerPassword1}
            onPasswordChange={(e) => setRegisterPasword1(e)}
          />
          <InputField
            type={"password"}
            label={"heslo znovu"}
            value={registerPassword2}
            onPasswordChange={(e) => setRegisterPasword2(e)}
          />

          <ConfirmDeclineBtns
            confirmFunction={handleRegister}
            declineFunction={handleDecline}
          />
          <br />
          <p>
            Již máte účet? <Link to={"/login"}>Přihlašte se.</Link>{" "}
          </p>
        </form>
      )}
    </section>
  );
};

export default Register;
