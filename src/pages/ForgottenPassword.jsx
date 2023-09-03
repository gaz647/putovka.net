import "./ForgottenPassword.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { passwordReset, runToast, resetToast } from "../redux/AuthSlice";
import { ToastContainer, toast, Flip } from "react-toastify";

const ForgottenPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(passwordReset(email));
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Email s odkazem pro obnovu hesla byl úspěšně odeslán!",
          secondMessage: "Zkontrolujte Vaši emailovou schránku.",
        },
      });
    } else {
      // alert("Zadejte Váš email");
      dispatch(
        runToast({ message: "Zadejte email", style: "error", time: 3000 })
      );
    }
  };

  const handleDecline = () => {
    navigate("/login");
  };

  const toastRedux = useSelector((state) => state.auth.toast);

  useEffect(() => {
    if (toastRedux.isVisible) {
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
      <header className="forgotten-password-header">
        <h1 className="forgotten-password-title">Obnovit heslo</h1>
      </header>
      <main>
        <form className="forgotten-password-form" onSubmit={handleSubmit}>
          <input
            className="forgotten-password-input"
            type="email"
            placeholder="zadejte Váš email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="confirm-decline-buttons-container">
            <button className="confirm-btn" type="submit">
              obnovit
            </button>
            <button
              className="decline-btn"
              type="submit"
              onClick={handleDecline}
            >
              zrušit
            </button>
          </div>
        </form>
      </main>
    </section>
  );
};

export default ForgottenPassword;
