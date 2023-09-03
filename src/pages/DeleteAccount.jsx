import "./DeleteAccount.css";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAccountDeleted = useSelector((state) => state.auth.isAccountDeleted);

  const [currentPassword, setCurrentPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // dodělat asyncThunk pro smazání účtu (podívat se jestli je potřeba reauthenticate)
    dispatch();
  };

  useEffect(() => {
    if (isAccountDeleted) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Váš účet byl SMAZÁN!",
          secondMessage: "",
        },
      });
    }
  }, [isAccountDeleted, navigate]);

  const handleDecline = () => {
    navigate("/settings");
  };

  return (
    <section className="wrapper">
      <header className="change-email-password-header">
        <div className="change-email-password-header-title">SMAZÁNÍ ÚČTU</div>
      </header>
      <main>
        <form className="change-email-password-form" onSubmit={handleSubmit}>
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
          <div className="change-email-password-form-container">
            <label className="change-email-password-form-item-container-label">
              opište následující kód:
              <br />
              <span className="delete-account-code">kgwoetgjowg</span>
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

export default DeleteAccount;
