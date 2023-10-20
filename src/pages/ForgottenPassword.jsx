import "./ForgottenPassword.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordRedux,
  runToastRedux,
  resetToastRedux,
} from "../redux/AuthSlice";
import { ToastContainer, toast, Flip } from "react-toastify";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import Heading from "../components/Heading";

const ForgottenPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const toastRedux = useSelector((state) => state.auth.toast);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );
  const isPasswordResetSuccess = useSelector(
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
    <section className="wrapper">
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
          <Heading text={"Probíhá resetování hesla . . ."} />
          <Spinner />
        </div>
      ) : (
        <>
          <header className="forgotten-password-header">
            <h1 className="forgotten-password-title">Obnovit heslo</h1>
          </header>
          <main>
            <form className="forgotten-password-form">
              <input
                className="forgotten-password-input"
                type="email"
                placeholder="zadejte Váš email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <ConfirmDeclineBtns
                confirmFunction={handleSubmit}
                declineFunction={handleDecline}
              />
            </form>
          </main>
        </>
      )}
    </section>
  );
};

export default ForgottenPassword;
