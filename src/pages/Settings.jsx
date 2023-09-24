import "./Settings.css";
import { useDispatch } from "react-redux";
import { changeSettingsRedux, logoutInSettingsRedux } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { setLoadingFalse } from "../redux/AuthSlice";
// import Spinner from "../components/Spinner";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner2 from "../components/Spinner2";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE SELECTOR
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

  // USE STATE ---------------------------------------------------------------
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

  // USE EFFECT
  //
  useEffect(() => {
    if (isAccountLogoutSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Odhlášení proběhlo úspěšně",
          secondMessage: "Nyní proběhne přesměrování na přihlašovací obrazovku",
        },
      });
    }
  }, [dispatch, isAccountLogoutSuccess, navigate]);

  // HANDLE LOGOUT
  //
  const handleLogout = () => {
    dispatch(logoutInSettingsRedux());
    // dispatch(logoutOnAuthRedux());
  };

  // HANDLE SUBMIT
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

  // HANDLE DECLINE
  //
  const handleDecline = () => {
    navigate("/");
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
          <header className="settings-header">
            <h1 className="settings-header-title">Nastavení</h1>
            <div className="settings-header-user-email">
              {loggedInUserEmail}
            </div>
            <button
              className="settings-header-user-btns"
              onClick={() => handleLogout()}
            >
              odhlásit
            </button>
            <Link className="settings-header-user-btns" to={"/change-email"}>
              změnit email
            </Link>
            <Link className="settings-header-user-btns" to={"/change-password"}>
              změnit heslo
            </Link>
            <Link className="settings-header-user-btns" to={"/delete-account"}>
              smazat účet
            </Link>
          </header>
          <main>
            <form className="settings-form">
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  terminál
                </label>
                <select
                  className="settings-form-item-container-input"
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                >
                  <option value="ceska_trebova">Česká Třebová</option>
                  <option value="ostrava">Ostrava</option>
                  <option value="plzen">Plzeň</option>
                  <option value="praha">Praha</option>
                  <option value="usti_nad_labem">Ústí nad Labem</option>
                  <option value="zlin">Zlín</option>
                </select>
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  základní mzda
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={baseMoney}
                  onChange={(e) => setBaseMoney(e.target.value)}
                />
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  % z fakturace
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  příplatek za druhou práci (Kč)
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={secondJobBenefit}
                  onChange={(e) => setSecondJobBenefit(e.target.value)}
                />
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  příplatek za čekání - <br />{" "}
                  <span className="settings-form-item-container-label-info-text">
                    (zaměstnavatel Kč)
                  </span>
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={waitingBenefitEmployerCzk}
                  onChange={(e) => setWaitingBenefitEmployerCzk(e.target.value)}
                />
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  příplatek za čekání (€)
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={waitingBenefitEur}
                  onChange={(e) => setWaitingBenefitEur(e.target.value)}
                />
              </div>
              <div className="settings-form-item-container">
                <label className="settings-form-item-container-label">
                  kurz Eur / Kč
                  <br />
                  <span className="settings-form-item-container-label-info-text">
                    (automaticky aktualizován po archivaci)
                  </span>
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={eurCzkRate}
                  onChange={(e) => setEurCzkRate(e.target.value)}
                />
              </div>
              <br />

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

export default Settings;
