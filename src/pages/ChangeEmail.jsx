import "./ChangeEmail.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changeEmailRedux, logoutRedux } from "../redux/AuthSlice";
import resetIsAccountDisabled from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isEmailChangedSuccess = useSelector(
    (state) => state.auth.isEmailChangedSuccess
  );
  const isAccountDisabled = useSelector(
    (state) => state.auth.isAccountDisabled
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // CHANGE EMAIL --------------------------------------------------------
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

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/settings");
  };

  // USE EFFECT ----------------------------------------------------------
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

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Heading text={"Probíhá změna emailu . . ."} />
          <Spinner />
        </div>
      ) : (
        <>
          <Heading text={"změna EMAILU"} />

          <main>
            <form className="change-email-password-form">
              <InputField
                type={"email"}
                label={"nový email"}
                onEmailChange={(e) => setNewEmail1(e)}
              />
              <InputField
                type={"email"}
                label={"nový email znovu"}
                onEmailChange={(e) => setNewEmail2(e)}
              />
              <br />
              <InputField
                type={"password"}
                label={"současné heslo"}
                onPasswordChange={(e) => setCurrentPassword(e)}
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

export default ChangeEmail;
