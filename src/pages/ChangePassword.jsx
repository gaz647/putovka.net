import "./ChangeEmail.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isPasswordChangedSuccess = useSelector(
    (state) => state.auth.isPasswordChangedSuccess
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // CHANGE EMAIL --------------------------------------------------------
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

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  // USE EFFECT ----------------------------------------------------------
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

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Heading text={"Probíhá změna hesla . . ."} />
          <p>isLoading2</p>
          <Spinner />
        </div>
      ) : (
        <>
          <Heading text={"změna HESLA"} />

          <main>
            <form className="change-email-password-form">
              <InputField
                type={"password"}
                label={"současné heslo"}
                onPasswordChange={(e) => setCurrentPassword(e)}
              />
              <br />
              <InputField
                type={"password"}
                label={"nové heslo"}
                onPasswordChange={(e) => setNewPassword1(e)}
              />
              <InputField
                type={"password"}
                label={"nové heslo znovu"}
                onPasswordChange={(e) => setNewPassword2(e)}
              />

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
