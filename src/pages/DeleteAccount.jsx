import "./DeleteAccount.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { runToastRedux, deleteAccountRedux } from "../redux/AuthSlice";
import ModalPrompt from "../components/ModalPrompt";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const isAccountDeletedSuccess = useSelector(
    (state) => state.auth.isAccountDeletedSuccess
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [deleteCode, setDeleteCode] = useState(uuidv4().substring(0, 8));
  const [userConfirmationCode, setUserConfirmationCode] = useState("");

  // HANDLE DELETE MODAL VISIBILITY --------------------------------------
  //
  const handleDeleteJobModalVisibility = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  // HANDLE SUBMIT -------------------------------------------------------
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

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  // DELETE ACCOUNT ------------------------------------------------------
  //
  const deleteAccount = () => {
    dispatch(deleteAccountRedux({ currentPassword, userUid }));
    handleDeleteJobModalVisibility();
    setCurrentPassword("");
    setUserConfirmationCode("");
    setDeleteCode(uuidv4().substring(0, 8));
  };

  // USE EFFECT ----------------------------------------------------------
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

  return (
    <div className="background">
      <section className="wrapper">
        {showDeleteJobModal && (
          <ModalPrompt
            heading={"Opravdu si přejete smazat Váš účet a všechna Vaše data?"}
            text={"Tuto akci nelze vzít zpět"}
            confirmFunction={deleteAccount}
            declineFunction={handleDeleteJobModalVisibility}
          />
        )}
        {isLoading2 ? (
          <>
            <Heading text={"Odstraňování účtu probíhá"} />
            <p>isLoading2</p>
            <Spinner2 />
          </>
        ) : (
          <>
            <Heading text={"SMAZÁNÍ ÚČTU"} />

            <main>
              <form className="change-email-password-form">
                <InputField
                  type={"password"}
                  label={"současné heslo"}
                  onPasswordChange={(e) => setCurrentPassword(e)}
                />

                <InputField
                  type={"text"}
                  label={"opište následující kód:"}
                  deleteCode={deleteCode}
                  onTextChange={(e) => setUserConfirmationCode(e)}
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
    </div>
  );
};

export default DeleteAccount;
