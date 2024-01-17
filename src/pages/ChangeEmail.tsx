import "./ChangeEmail.css";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeEmailRedux,
  logoutRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { resetIsAccountDisabledRedux } from "../redux/AuthSlice";
import isValidEmailFormat from "../customFunctionsAndHooks/isValidEmailFormat";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const ChangeEmail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isChangeEmailReduxSuccess = useAppSelector(
    (state) => state.auth.isChangeEmailReduxSuccess
  );
  const isAccountDisabled = useAppSelector(
    (state) => state.auth.isAccountDisabled
  );
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // CHANGE EMAIL --------------------------------------------------------
  //
  const changeEmail = () => {
    if (newEmail1 && newEmail2 && newEmail1 === newEmail2 && currentPassword) {
      console.log(
        "ChangeEmail.tsx - Uživatel vyplnil nový email - bude spuštěn dispatch pro změnu emailu"
      );
      dispatch(changeEmailRedux({ currentPassword, newEmail: newEmail1 }));
    } else if (!currentPassword || !newEmail1 || !newEmail2) {
      dispatch(
        runToastRedux({
          message: "Vyplňte všechna pole!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else if (newEmail1 !== newEmail2) {
      console.log(
        "ChangeEmail - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
      dispatch(
        runToastRedux({
          message: "Emaily se neshodují!",
          style: "error",
          time: 3000,
        })
      );
      return;
    }
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isChangeEmailReduxSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Váš email byl změněn!",
          secondMessage:
            "Zkontrolujte Vaši emailovou schránku a změnu potvrďte.",
        },
      });
    }
  }, [isChangeEmailReduxSuccess, navigate]);

  useEffect(() => {
    if (isAccountDisabled === true) {
      console.log("isAccountDisabled", isAccountDisabled);
      dispatch(resetIsAccountDisabledRedux());
      dispatch(logoutRedux());
    }
  }, [dispatch, isAccountDisabled]);

  return (
    <section className="full-page-container-center">
      {isLoading2 ? (
        <>
          <Heading text={"Probíhá změna emailu . . ."} />
          <Spinner />
        </>
      ) : (
        <form className="change-form">
          <Heading text={"změna EMAILU"} />

          <InputField
            type={"email"}
            label={"nový email"}
            value={newEmail1}
            onEmailChange={(e) => setNewEmail1(e)}
          />
          <InputField
            type={"email"}
            label={"nový email znovu"}
            value={newEmail2}
            onEmailChange={(e) => setNewEmail2(e)}
          />
          <br />
          <InputField
            type={"password"}
            label={"současné heslo"}
            value={currentPassword}
            onPasswordChange={(e) => setCurrentPassword(e)}
          />

          <ConfirmDeclineBtns
            disabled={
              !newEmail1 ||
              !newEmail2 ||
              !currentPassword ||
              !isValidEmailFormat(newEmail1) ||
              !isValidEmailFormat(newEmail2)
            }
            confirmFunction={changeEmail}
            declineFunction={handleDecline}
          />
        </form>
      )}
    </section>
  );
};

export default ChangeEmail;
