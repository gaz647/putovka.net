import "./Settings.css";
import { useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { setLoadingFalse } from "../redux/AuthSlice";
import Spinner from "../components/Spinner";

const Settings = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loggedInUserEmail = useSelector(
    (state) => state.auth.loggedInUserEmail
  );
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const loggedInUserData = useSelector((state) => state.auth.loggedInUserData);

  const handleLogout = () => {
    dispatch(logout());
  };

  const [terminal, setTerminal] = useState(
    loggedInUserData.userSettings.terminal
  );
  const [baseMoney, setBaseMoney] = useState(
    loggedInUserData.userSettings.baseMoney
  );
  const [percentage, setPercentage] = useState(
    loggedInUserData.userSettings.percentage
  );
  const [secondJobBenefit, setSecondJobBenefit] = useState(
    loggedInUserData.userSettings.secondJobBenefit
  );
  const [waitingBenefit, setWaitingBenefit] = useState(
    loggedInUserData.userSettings.waitingBenefit
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("click");
  };

  const handleDecline = () => {
    navigate("/");
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className="wrapper">
          <header className="settings-header">
            <div className="settings-header-container-left">
              <h1 className="settings-header-title">Nastavení</h1>
            </div>
            <div className="settings-header-container-right">
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
              <Link
                className="settings-header-user-btns"
                to={"/change-password"}
              >
                změnit heslo
              </Link>
            </div>
          </header>
          <main>
            <form className="settings-form" onSubmit={handleSubmit}>
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
                  příplatek za čekání (Kč)
                </label>
                <input
                  className="settings-form-item-container-input"
                  type="number"
                  value={waitingBenefit}
                  onChange={(e) => setWaitingBenefit(e.target.value)}
                />
              </div>
              <br />
              <div className="confirm-decline-buttons-container">
                <button className="confirm-btn" type="submit">
                  uložit
                </button>
                <button
                  className="decline-btn"
                  type="button"
                  onClick={handleDecline}
                >
                  zrušit
                </button>
              </div>
            </form>
          </main>
        </section>
      )}
    </>
  );
};

export default Settings;
