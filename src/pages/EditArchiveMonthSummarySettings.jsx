import "./Settings.css";
import { useDispatch } from "react-redux";
import {
  editArchiveMonthSummarySettingsRedux,
  resetArchiveMonthSummarySettingsToEditRedux,
} from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import Heading from "../components/Heading";

const EditArchiveMonthSummarySettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const date = useSelector(
    (state) => state.auth.archiveMonthSummarySettingsToEdit.date
  );
  const email = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.email
  );
  const terminal = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.terminal
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //
  const [baseMoney, setBaseMoney] = useState(
    useSelector(
      (state) => state.auth.archiveMonthSummarySettingsToEdit.baseMoney
    )
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
  const [isConfirmDeclineBtnsVisible, setIsConfirmDeclineBtnsVisible] =
    useState(false);

  // HANDLE SUBMIT -------------------------------------------------------
  //
  const handleSubmit = () => {
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
    dispatch(editArchiveMonthSummarySettingsRedux(payload));
    navigate("/archive");
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetArchiveMonthSummarySettingsToEditRedux());
    navigate("/archive");
  };

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <header className="settings-header">
            <Heading text={"Změna nastavení archivovaného měsíce"} />
          </header>
          <main>
            <form className="settings-form">
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
              <div className="confirm-decline-buttons-container">
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

export default EditArchiveMonthSummarySettings;
