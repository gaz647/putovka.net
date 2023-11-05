import "./DeleteAccount.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { runToastRedux, deleteAccountRedux } from "../redux/AuthSlice";
import ModalPrompt from "../components/ModalPrompt";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
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
  const isDeleteAccountReduxSuccess = useSelector(
    (state) => state.auth.isDeleteAccountReduxSuccess
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
    if (currentPassword && userConfirmationCode === deleteCode) {
      // Vše vyplněné - nyní se otevře modal
      handleDeleteJobModalVisibility();
    } else if (!userConfirmationCode || !currentPassword) {
      dispatch(
        runToastRedux({
          message: "Vyplňte všechna pole!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else if (userConfirmationCode !== deleteCode) {
      dispatch(
        runToastRedux({ message: "Špatný kód", style: "error", time: 3000 })
      );
      return;
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
    if (isDeleteAccountReduxSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Váš účet a veškerá Vaše data byla smazána",
          secondMessage: "Třeba někdy příště",
        },
      });
    }
  }, [dispatch, isDeleteAccountReduxSuccess, navigate]);

  return (
    <section className="full-page-container-center">
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
          <Spinner />
        </>
      ) : (
        <>
          <Heading text={"SMAZÁNÍ ÚČTU"} />

          <form className="change-form">
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
        </>
      )}
    </section>
  );
};

export default DeleteAccount;
