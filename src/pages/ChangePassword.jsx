import "./ChangePassword.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE SELECTOR
  //
  const isPasswordChangedSuccess = useSelector(
    (state) => state.auth.isPasswordChangedSuccess
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE
  //
  const [currentPassword, setCurrentPassword1] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // USE EFFECT
  //
  useEffect(() => {
    if (isPasswordChangedSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Vaše heslo bylo změněno!",
          secondMessage: "",
        },
      });
    }
  }, [isPasswordChangedSuccess, navigate]);

  // CHANGE EMAIL
  //
  const changeEmail = () => {
    console.log("click");
    // password password
    if (
      currentPassword &&
      newPassword1 &&
      newPassword1.length > 5 &&
      newPassword2 &&
      newPassword2.length > 5 &&
      newPassword1 === newPassword2
    ) {
      console.log(
        "ChangePassword.jsx - Uživatel vyplnil nové heslo - bude spuštěn dispatch pro změnu hesla"
      );
      dispatch(
        changePasswordRedux({ currentPassword, newPassword: newPassword1 })
      );
    } else {
      console.log(
        "ChangePassword - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
    }
  };

  // HANDLE DECLINE
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <>
          <h1>Probíhá změna hesla</h1>
          <p>isLoading2</p>
          <Spinner2 />
        </>
      ) : (
        <>
          <header className="change-email-password-header">
            <div className="change-email-password-header-title">
              změna hesla
            </div>
          </header>
          <main>
            <form className="change-email-password-form">
              <div className="change-email-password-form-container">
                <label className="change-email-password-form-item-container-label">
                  současné heslo
                </label>
                <div className="change-email-password-form-item-container-password">
                  <input
                    className="change-email-password-form-item-container-input"
                    type="password"
                    placeholder="současné heslo"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword1(e.target.value)}
                  />

                  <div className="warning-container">
                    {((newPassword1.length > 0 &&
                      newPassword1.length < 6 &&
                      !newPassword2) ||
                      (newPassword2.length > 0 &&
                        newPassword2.length < 6 &&
                        !newPassword1)) && (
                      <div className="warning-message">minimálně 6 znaků</div>
                    )}
                    {newPassword1.length > 5 &&
                      newPassword2.length > 5 &&
                      newPassword1 !== newPassword2 && (
                        <div className="warning-message">
                          hesla se neshodují
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="change-email-password-form-container">
                <label className="change-email-password-form-item-container-label">
                  nové heslo
                </label>
                <div className="change-email-password-form-item-container-password">
                  <input
                    className="change-email-password-form-item-container-input"
                    type="password"
                    placeholder="nové heslo"
                    value={newPassword1}
                    onChange={(e) => setNewPassword1(e.target.value)}
                  />
                  <input
                    className="change-email-password-form-item-container-input"
                    type="password"
                    placeholder="nové heslo znovu"
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    disabled={newPassword1.length < 6}
                  />
                  <div className="warning-container">
                    {((newPassword1.length > 0 &&
                      newPassword1.length < 6 &&
                      !newPassword2) ||
                      (newPassword2.length > 0 &&
                        newPassword2.length < 6 &&
                        !newPassword1)) && (
                      <div className="warning-message">minimálně 6 znaků</div>
                    )}
                    {newPassword1.length > 5 &&
                      newPassword2.length > 5 &&
                      newPassword1 !== newPassword2 && (
                        <div className="warning-message">
                          hesla se neshodují
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <ConfirmDeclineBtns
                confirmFunction={changeEmail}
                declineFunction={handleDecline}
              />
            </form>
          </main>
        </>
      )}
    </section>
  );
};

export default ChangePassword;
