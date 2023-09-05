import "./Settings.css";
import { useDispatch } from "react-redux";
import {
  editArchiveMonthSummarySettingsInDatabase,
  resetArchiveMonthSummarySettingsToEdit,
} from "../redux/AuthSlice";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { setLoadingFalse } from "../redux/AuthSlice";
import Spinner from "../components/Spinner";

const EditArchiveMonthSummarySettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  const date = useSelector(
    (state) => state.auth.archiveMonthSummarySettingsToEdit.date
  );

  const [baseMoney, setBaseMoney] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.baseMoney
    )
  );

  const email = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.email
  );

  const [eurCzkRate, setEurCzkRate] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.eurCzkRate
    )
  );

  const [percentage, setPercentage] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.percentage
    )
  );

  const [secondJobBenefit, setSecondJobBenefit] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.secondJobBenefit
    )
  );

  const terminal = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.terminal
  );

  const [waitingBenefitEmployerCzk, setWaitingBenefitEmployerCzk] = useState(
    useSelector(
      (state) =>
        state.auth.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk
    )
  );

  const [waitingBenefitEur, setWaitingBenefitEur] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.waitingBenefitEur
    )
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempArchivedJobs = [...archivedJobs];

    const newArchiveMonthSummarySettings = {
      baseMoney: Number(baseMoney),
      email,
      eurCzkRate: Number(eurCzkRate),
      percentage: Number(percentage),
      secondJobBenefit: Number(secondJobBenefit),
      terminal,
      waitingBenefitEmployerCzk: Number(waitingBenefitEmployerCzk),
      waitingBenefitEur: Number(waitingBenefitEur),
    };

    const updatedArchivedJobs = tempArchivedJobs.map((archive) => {
      if (archive.date === date) {
        return {
          ...archive,
          userSettings: newArchiveMonthSummarySettings,
        };
      }
      return archive;
    });

    const payload = {
      userUid,
      updatedArchivedJobs,
    };
    dispatch(editArchiveMonthSummarySettingsInDatabase(payload));
    navigate("/archive");
  };

  const handleDecline = () => {
    dispatch(resetArchiveMonthSummarySettingsToEdit());
    navigate("/");
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className="wrapper">
          <header className="settings-header">
            <h1 className="settings-header-title">
              Změna nastavení archivovaného měsíce
            </h1>
          </header>
          <main>
            <form className="settings-form" onSubmit={handleSubmit}>
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
              <div className="confirm-decline-buttons-container">
                <button
                  className="confirm-btn"
                  type="submit"
                  onClick={handleSubmit}
                >
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

export default EditArchiveMonthSummarySettings;
