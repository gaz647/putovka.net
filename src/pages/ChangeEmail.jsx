import "./ChangeEmail.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changeEmailRedux, logoutRedux } from "../redux/AuthSlice";
import resetIsAccountDisabled from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  USE SELECTOR
  const isEmailChangedSuccess = useSelector(
    (state) => state.auth.isEmailChangedSuccess
  );
  const isAccountDisabled = useSelector(
    (state) => state.auth.isAccountDisabled
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE
  //
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // USE EFFECT
  //
  useEffect(() => {
    if (isEmailChangedSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Váš email byl změněn!",
          secondMessage:
            "Zkontrolujte Vaši emailovou schránku a změnu potvrďte.",
        },
      });
    }
  }, [isEmailChangedSuccess, navigate]);

  useEffect(() => {
    if (isAccountDisabled === true) {
      console.log("isAccountDisabled", isAccountDisabled);
      dispatch(resetIsAccountDisabled);
      dispatch(logoutRedux());
    }
  }, [dispatch, isAccountDisabled]);

  // CHANGE EMAIL
  //
  const changeEmail = () => {
    console.log("click");
    // email email
    if (newEmail1 && newEmail2 && newEmail1 === newEmail2 && currentPassword) {
      console.log(
        "ChangeEmail.jsx - Uživatel vyplnil nový email - bude spuštěn dispatch pro změnu emailu"
      );
      dispatch(changeEmailRedux({ currentPassword, newEmail: newEmail1 }));
    } else {
      console.log(
        "ChangeEmail - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
    }
  };

  // HANDLE DECLINE
  const handleDecline = () => {
    navigate("/settings");
  };

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <>
          <h1>Odstraňování účtu probíhá</h1>
          <p>isLoading2</p>
          <Spinner2 />
        </>
      ) : (
        <>
          <header className="change-email-password-header">
            <div className="change-email-password-header-title">
              změna emailu
            </div>
          </header>
          <main>
            <form className="change-email-password-form">
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

export default ChangeEmail;
