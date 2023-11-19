import "./Login.css";
import "./Register.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  registerRedux,
  runToastRedux,
  resetToastRedux,
} from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import isValidEmailFormat from "../customFunctionsAndHooks/isValidEmailFormat";
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
  const [checkbox1Checked, setCheckbox1Cheked] = useState(false);
  const [checkbox2Checked, setCheckbox2Cheked] = useState(false);

  // HANDLE CHECKBOX CHECKED ---------------------------------------------
  //
  const handleCheckbox1Checked = () => {
    setCheckbox1Cheked(!checkbox1Checked);
  };

  const handleCheckbox2Checked = () => {
    setCheckbox2Cheked(!checkbox2Checked);
  };

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
    }

    if (registerPassword1.length < 6 || registerPassword2.length < 6) {
      dispatch(
        runToastRedux({
          message: "Heslo musí mít alespoň 6 znaků!",
          style: "error",
          time: 3000,
        })
      );
      return;
    }

    const registerCredentials = { registerEmail, registerPassword1 };
    dispatch(registerRedux(registerCredentials));
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = (e) => {
    e.preventDefault();
    // navigate("/login");
    setRegisterEmail("");
    setRegisterPasword1("");
    setRegisterPasword2("");
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
            label={"email"}
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

          <div className="terms-and-conditions-container">
            <div className="terms-and-conditions-one-condition-container">
              <input
                type="checkbox"
                className="terms-and-conditions-checkbox"
                onClick={handleCheckbox1Checked}
              />
              <div className="terms-and-conditions-text">
                Souhlasím s{" "}
                <span>
                  <Link to={"/terms-and-conditions"} target="_blank">
                    Obchodními podmínkami.
                  </Link>
                </span>
              </div>
            </div>
            <br />
            <div className="terms-and-conditions-one-condition-container">
              <input
                type="checkbox"
                className="terms-and-conditions-checkbox"
                onClick={handleCheckbox2Checked}
              />
              <div className="terms-and-conditions-text">
                Souhlasím se{" "}
                <span>
                  <Link to={"/personal-data-processing"} target="_blank">
                    zpracováním osobních údajů.
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <ConfirmDeclineBtns
            register={true}
            disabled={
              !registerEmail ||
              !registerPassword1 ||
              !registerPassword2 ||
              !checkbox1Checked ||
              !checkbox2Checked ||
              !isValidEmailFormat(registerEmail)
            }
            confirmFunction={handleRegister}
            declineFunction={handleDecline}
          />

          <br />
          <p className="login-register-bottom-link">
            Již máte účet? <Link to={"/login"}>Přihlašte se.</Link>
          </p>
        </form>
      )}
    </section>
  );
};

export default Register;
