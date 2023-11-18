import "./Settings.css";
import { useDispatch } from "react-redux";
import {
  editArchiveMonthSummarySettingsRedux,
  resetArchiveMonthSummarySettingsToEditRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
  const isEditArchiveMonthSummarySettingsReduxSuccess = useSelector(
    (state) => state.auth.isEditArchiveMonthSummarySettingsReduxSuccess
  );

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

  // HANDLE SUBMIT -------------------------------------------------------
  //
  const handleSubmit = () => {
    if (!eurCzkRate) {
      dispatch(
        runToastRedux({
          message: "Vyplňte povinná pole.",
          style: "error",
          time: 3000,
        })
      );
      return;
    }
    const tempArchivedJobs = [...archivedJobs];

    const newArchiveMonthSummarySettings = {
      baseMoney: Number(baseMoney),
      eurCzkRate: Number(eurCzkRate),
      percentage: Number(percentage),
      secondJobBenefit: Number(secondJobBenefit),
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
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetArchiveMonthSummarySettingsToEditRedux());
    navigate("/archive");
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isEditArchiveMonthSummarySettingsReduxSuccess) {
      navigate("/archive");
    }
  }, [isEditArchiveMonthSummarySettingsReduxSuccess, navigate]);

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
                }}
              />
              <InputField
                type={"number"}
                label={"% z fakturace"}
                value={percentage}
                onNumberChange={(e) => {
                  setPercentage(e);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za druhou práci"}
                subLabel={"(Kč)"}
                value={secondJobBenefit}
                onNumberChange={(e) => {
                  setSecondJobBenefit(e);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za čekání - zaměstnavatel"}
                subLabel={"(Kč)"}
                value={waitingBenefitEmployerCzk}
                onNumberChange={(e) => {
                  setWaitingBenefitEmployerCzk(e);
                }}
              />
              <InputField
                type={"number"}
                label={"příplatek za čekání"}
                subLabel={"(€)"}
                value={waitingBenefitEur}
                onNumberChange={(e) => {
                  setWaitingBenefitEur(e);
                }}
              />
              <InputField
                required={true}
                type={"number-decimal"}
                label={"kurz Eur/Kč"}
                subLabel={"(automaticky aktualizován po archivaci)"}
                value={eurCzkRate}
                onNumberChange={(e) => {
                  setEurCzkRate(e);
                }}
              />
              <br />
              <div className="confirm-decline-buttons-container">
                <ConfirmDeclineBtns
                  disabled={!eurCzkRate}
                  confirmFunction={handleSubmit}
                  declineFunction={handleDecline}
                />
              </div>
            </form>
          </main>
        </>
      )}
    </section>
  );
};

export default EditArchiveMonthSummarySettings;
