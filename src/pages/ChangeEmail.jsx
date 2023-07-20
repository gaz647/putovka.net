import "./ChangeEmail.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeEmail } from "../redux/AuthSlice";

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("click");
    // email email
    if (newEmail1 && newEmail2 && newEmail1 === newEmail2 && currentPassword) {
      console.log(
        "ChangeEmail.jsx - Uživatel vyplnil nový email - bude spuštěn dispatch pro změnu emailu"
      );
      dispatch(changeEmail({ currentPassword, newEmail: newEmail1 }));
      navigate("/email-changed");
    } else {
      console.log(
        "ChangeEmailPassword - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
    }
  };

  const handleDecline = () => {
    navigate("/settings");
  };

  return (
    <section className="wrapper">
      <header className="change-email-password-header">
        <div className="change-email-password-header-title">změna emailu</div>
      </header>
      <main>
        <form className="change-email-password-form" onSubmit={handleSubmit}>
          <div className="change-email-password-form-container">
            <label className="change-email-password-form-item-container-label">
              nový email
            </label>
            <div className="change-email-password-form-item-container-email">
              <input
                className="change-email-password-form-item-container-input"
                type="email"
                placeholder="nový email"
                value={newEmail1}
                onChange={(e) => setNewEmail1(e.target.value)}
              />

              <input
                className="change-email-password-form-item-container-input"
                type="email"
                placeholder="nový email znovu"
                value={newEmail2}
                onChange={(e) => setNewEmail2(e.target.value)}
                disabled={!newEmail1}
              />
              <div className="warning-container">
                {newEmail1 && newEmail2 && newEmail1 !== newEmail2 ? (
                  <div className="warning-message">emaily se neshodují</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="change-email-password-form-container">
            <label className="change-email-password-form-item-container-label">
              současné heslo pro potvrzení
            </label>
            <div className="change-email-password-form-item-container-email">
              <input
                className="change-email-password-form-item-container-input"
                type="password"
                placeholder="současné heslo"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {/* <div className="warning-container">
                {newEmail1 && newEmail2 && newEmail1 !== newEmail2 ? (
                  <div className="warning-message">emaily se neshodují</div>
                ) : (
                  ""
                )}
              </div> */}
            </div>
          </div>

          <div className="confirm-decline-buttons-container">
            <button className="confirm-btn" type="submit">
              změnit
            </button>
            <button
              className="decline-btn"
              type="button"
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

export default ChangeEmail;
