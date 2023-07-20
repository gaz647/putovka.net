import "./ForgottenPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { passwordReset } from "../redux/AuthSlice";

const ForgottenPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(passwordReset(email));
      navigate("/forgotten-password-sent");
    } else {
      alert("Zadejte Váš email");
    }
  };

  const handleDecline = () => {
    navigate("/login");
  };

  return (
    <section className="wrapper">
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
