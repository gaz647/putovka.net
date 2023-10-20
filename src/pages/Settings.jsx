import "./Settings.css";
import { useDispatch } from "react-redux";
import { changeSettingsRedux, logoutInSettingsRedux } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const loggedInUserEmail = useSelector(
    (state) => state.auth.loggedInUserEmail
  );
  // const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isAccountLogoutSuccess = useSelector(
    (state) => state.auth.isAccountLogoutSuccess
  );
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const email = useSelector((state) => state.auth.loggedInUserEmail);

  // USE STATE -----------------------------------------------------------
  //
  const [baseMoney, setBaseMoney] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.baseMoney)
  );
  const [terminal, setTerminal] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.terminal)
  );
  const [percentage, setPercentage] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.percentage)
  );
  const [secondJobBenefit, setSecondJobBenefit] = useState(
    useSelector(
      (state) => state.auth.loggedInUserData.userSettings.secondJobBenefit
    )
  );
  const [waitingBenefitEmployerCzk, setWaitingBenefitEmployerCzk] = useState(
    useSelector(
      (state) =>
        state.auth.loggedInUserData.userSettings.waitingBenefitEmployerCzk
    )
  );
  const [waitingBenefitEur, setWaitingBenefitEur] = useState(
    useSelector(
      (state) => state.auth.loggedInUserData.userSettings.waitingBenefitEur
    )
  );
  const [eurCzkRate, setEurCzkRate] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.eurCzkRate)
  );
  const [isConfirmDeclineBtnsVisible, setIsConfirmDeclineBtnsVisible] =
    useState(false);

  // HANDLE SUBMIT -------------------------------------------------------
  //
  const handleSubmit = () => {
    const payload = {
      userUid,
      userSettings: {
        baseMoney: Number(baseMoney),
        email,
        eurCzkRate: Number(eurCzkRate),
        percentage: Number(percentage),
        secondJobBenefit: Number(secondJobBenefit),
        terminal,
        waitingBenefitEmployerCzk: Number(waitingBenefitEmployerCzk),
        waitingBenefitEur: Number(waitingBenefitEur),
      },
    };
    dispatch(changeSettingsRedux(payload));
    navigate("/");
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/");
  };

  // HANDLE LOGOUT -------------------------------------------------------
  //
  const handleLogout = () => {
    dispatch(logoutInSettingsRedux());
    // dispatch(logoutOnAuthRedux());
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isAccountLogoutSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Odhlášení proběhlo úspěšně",
        },
      });
    }
  }, [dispatch, isAccountLogoutSuccess, navigate]);

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <header className="settings-header">
            <Heading text={"Nastavení"} />
            <div className="settings-header-user-email text-shadow">
              {loggedInUserEmail}
            </div>
            <button
              className="settings-header-user-btns text-shadow"
              onClick={() => handleLogout()}
            >
              odhlásit
            </button>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/change-email"}
            >
              změnit email
            </Link>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/change-password"}
            >
              změnit heslo
            </Link>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/delete-account"}
            >
              smazat účet
            </Link>
          </header>
          <main>
            <form className="settings-form">
              <InputField
                type={"terminal"}
                label={"terminál"}
                value={terminal}
                onTerminalChange={(e) => {
                  setTerminal(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number"}
                label={"základní mzda"}
                subLabel={"(Kč)"}
                value={baseMoney}
                onNumberChange={(e) => {
                  setBaseMoney(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number"}
                label={"% z fakturace"}
                value={percentage}
                onNumberChange={(e) => {
                  setPercentage(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za druhou práci"}
                subLabel={"(Kč)"}
                value={secondJobBenefit}
                onNumberChange={(e) => {
                  setSecondJobBenefit(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za čekání - zaměstnavatel"}
                subLabel={"(Kč)"}
                value={waitingBenefitEmployerCzk}
                onNumberChange={(e) => {
                  setWaitingBenefitEmployerCzk(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za čekání"}
                subLabel={"(€)"}
                value={waitingBenefitEur}
                onNumberChange={(e) => {
                  setWaitingBenefitEur(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <InputField
                type={"number-decimal"}
                label={"kurz Eur/Kč"}
                subLabel={"(automaticky aktualizován po archivaci)"}
                value={eurCzkRate}
                onNumberChange={(e) => {
                  setEurCzkRate(e);
                  setIsConfirmDeclineBtnsVisible(true);
                }}
              />
              <br />
              <div className="settings-form-confirm-decline-btns-container">
                {isConfirmDeclineBtnsVisible && (
                  <ConfirmDeclineBtns
                    confirmFunction={handleSubmit}
                    declineFunction={handleDecline}
                  />
                )}
              </div>
            </form>
          </main>
        </>
      )}
    </section>
  );
};

export default Settings;
