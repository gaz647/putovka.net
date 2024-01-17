import "./ForgottenPassword.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordRedux,
  runToastRedux,
  resetToastRedux,
} from "../redux/AuthSlice";
import { ToastContainer, toast, Flip } from "react-toastify";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const ForgottenPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const toastRedux = useAppSelector((state) => state.auth.toast);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);
  const resetToastStateRedux = useAppSelector(
    (state) => state.auth.toast.resetToast
  );
  const isPasswordResetSuccess = useAppSelector(
    (state) => state.auth.isPasswordResetSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [email, setEmail] = useState("");

  // HANDLE SUBMIT -------------------------------------------------------
  //
  const handleSubmit = () => {
    if (email) {
      dispatch(resetPasswordRedux(email));
    } else {
      // alert("Zadejte Váš email");
      dispatch(
        runToastRedux({ message: "Zadejte email", style: "error", time: 3000 })
      );
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
    if (toastRedux.isVisible) {
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

  useEffect(() => {
    if (isPasswordResetSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Email pro obnovu Vašeho hesla byl odeslán!",
          secondMessage: "Zkontrolujte Vaši emailovou schránku.",
        },
      });
    }
  }, [isPasswordResetSuccess, navigate]);

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
      {isLoading2 ? (
        <>
          <Heading text={"Probíhá resetování hesla . . ."} />
          <Spinner />
        </>
      ) : (
        <form className="change-form">
          <Heading text={"Obnovit heslo"} />

          <InputField
            type={"email"}
            label={"zadejte Váš email"}
            value={email}
            onEmailChange={(e) => setEmail(e)}
          />

          <ConfirmDeclineBtns
            confirmFunction={handleSubmit}
            declineFunction={handleDecline}
          />
        </form>
      )}
    </section>
  );
};

export default ForgottenPassword;
