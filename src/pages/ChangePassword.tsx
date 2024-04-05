import "./ChangeEmail.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordRedux, runToastRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isChangePasswordReduxSuccess = useAppSelector(
    (state) => state.auth.isChangePasswordReduxSuccess
  );
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // CHANGE PASSWORD --------------------------------------------------------
  //
  const changePassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
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
        "ChangePassword.tsx - Uživatel vyplnil nové heslo - bude spuštěn dispatch pro změnu hesla"
      );
      dispatch(
        changePasswordRedux({ currentPassword, newPassword: newPassword1 })
      );
    } else if (!currentPassword || !newPassword1 || !newPassword2) {
      console.log(
        "ChangePassword - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
      dispatch(
        runToastRedux({
          message: "Vyplňte všechna pole!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else if (newPassword1 !== newPassword2) {
      console.log("ChangeEmail - newPassword1 !== newPassword2");
      dispatch(
        runToastRedux({
          message: "Nová hesla se neshodují!",
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
    if (isChangePasswordReduxSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Vaše heslo bylo změněno!",
          secondMessage: "",
        },
      });
    }
  }, [isChangePasswordReduxSuccess, navigate]);

  return (
    <section className="full-page-container-center">
      {isLoading2 ? (
        <>
          <Heading text={"Probíhá změna hesla . . ."} />
          <Spinner />
        </>
      ) : (
        <form className="change-form">
          <Heading text={"změna HESLA"} />

          <InputField
            type={"password"}
            label={"nové heslo"}
            value={newPassword1}
            onPasswordChange={(e) => setNewPassword1(e)}
          />
          <InputField
            type={"password"}
            label={"nové heslo znovu"}
            value={newPassword2}
            onPasswordChange={(e) => setNewPassword2(e)}
          />
          <br />
          <InputField
            type={"password"}
            label={"současné heslo"}
            value={currentPassword}
            onPasswordChange={(e) => setCurrentPassword(e)}
          />

          <ConfirmDeclineBtns
            disabled={!newPassword1 || !newPassword2 || !currentPassword}
            confirmFunction={changePassword}
            declineFunction={handleDecline}
          />
        </form>
      )}
    </section>
  );
};

export default ChangePassword;
