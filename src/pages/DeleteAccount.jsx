import "./DeleteAccount.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { runToastRedux, deleteAccountRedux } from "../redux/AuthSlice";
import ModalPrompt from "../components/ModalPrompt";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE SELECTOR
  //
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const isAccountDeletedSuccess = useSelector(
    (state) => state.auth.isAccountDeletedSuccess
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE
  //
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [deleteCode, setDeleteCode] = useState(uuidv4().substring(0, 8));
  const [userConfirmationCode, setUserConfirmationCode] = useState("");

  //  USE EFFECT
  //
  useEffect(() => {
    if (isAccountDeletedSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Váš účet a veškerá Vaše data byla smazána",
          secondMessage: "Třeba někdy příště",
        },
      });
    }
  }, [dispatch, isAccountDeletedSuccess, navigate]);

  const deleteAccountModalHeading =
    "Opravdu si přejete smazat Váš účet a všechna Vaše data?";

  const deleteAccountModalText = "Tuto akci nelze vzít zpět";

  const handleDeleteJobModalVisibility = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  // HANDLE SUBMIT
  //
  const handleSubmit = () => {
    if (userConfirmationCode && currentPassword === "") {
      dispatch(
        runToastRedux({ message: "Zadejte heslo", style: "error", time: 3000 })
      );
      return;
    } else if (currentPassword && userConfirmationCode === "") {
      dispatch(
        runToastRedux({ message: "Opište kód", style: "error", time: 3000 })
      );
      return;
    } else if (
      currentPassword &&
      userConfirmationCode &&
      userConfirmationCode !== deleteCode
    ) {
      dispatch(
        runToastRedux({ message: "Špatný kód", style: "error", time: 3000 })
      );
      return;
    } else if (!currentPassword && !userConfirmationCode) {
      dispatch(
        runToastRedux({
          message: "Vyplňte požadová pole",
          style: "error",
          time: 3000,
        })
      );
    } else {
      // Vše vyplněné - nyní se otevře modal
      handleDeleteJobModalVisibility();
    }
  };

  // HANDLE DECLINE
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  // DELETE ACCOUNT
  //
  const deleteAccount = () => {
    dispatch(deleteAccountRedux({ currentPassword, userUid }));
    handleDeleteJobModalVisibility();
    setCurrentPassword("");
    setUserConfirmationCode("");
    setDeleteCode(uuidv4().substring(0, 8));
  };

  return (
    <section className="wrapper">
      {showDeleteJobModal && (
        <ModalPrompt
          heading={deleteAccountModalHeading}
          text={deleteAccountModalText}
          confirmFunction={deleteAccount}
          declineFunction={handleDeleteJobModalVisibility}
        />
      )}
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
              SMAZÁNÍ ÚČTU
            </div>
          </header>
          <main>
            <form className="change-email-password-form">
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
                  <span className="delete-account-code">{deleteCode}</span>
                </label>
                <div className="change-email-password-form-item-container-email">
                  <input
                    className="change-email-password-form-item-container-input"
                    type="password"
                    placeholder="kód pro potvrzení"
                    value={userConfirmationCode}
                    onChange={(e) => setUserConfirmationCode(e.target.value)}
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

export default DeleteAccount;
