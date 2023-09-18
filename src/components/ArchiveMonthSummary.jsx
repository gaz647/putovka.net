/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ArchiveMonthSummary.css";
import ModalPrompt from "./ModalPrompt";
import { BsPencil } from "react-icons/bs";
import { setArchiveMonthSummarySettingsToEditRedux } from "../redux/AuthSlice";
import getArchiveDate from "../customFunctionsAndHooks/getArchiveDate";
import getCzDateArchiveJobEmailFormat from "../customFunctionsAndHooks/getCzDateArchiveJobEmailFormat";

const ArchiveMonthSummary = ({ summary }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    date,
    summaryEur,
    summaryCzk,
    summarySecondJobs,
    summaryWaiting,
    summarySalary,
    summaryJobs,
    summaryBaseMoney,
    summaryPercentage,
    summarySecondJobBenefit,
    summaryWaitingBenefitEmployerCzk,
    summaryWaitingBenefitEur,
    summaryEurCzkRate,
    jobs,
  } = summary;

  const setEditArchiveMonthSummarySettings = () => {
    const payload = {
      date,
      baseMoney: summaryBaseMoney,
      percentage: summaryPercentage,
      secondJobBenefit: summarySecondJobBenefit,
      waitingBenefitEmployerCzk: summaryWaitingBenefitEmployerCzk,
      waitingBenefitEur: summaryWaitingBenefitEur,
      eurCzkRate: summaryEurCzkRate,
    };
    // dispatch(setIsEditingArchivedJob(true));
    dispatch(setArchiveMonthSummarySettingsToEditRedux(payload));
    setShowArchiveMonthSummarySettingsEditModal(false);
    navigate("/edit-archive-month-summary-settings");
  };

  const [
    showArchiveMonthSummarySettingsEditModal,
    setShowArchiveMonthSummarySettingsEditModal,
  ] = useState(false);

  const archiveMonthSummarySettingsEditModal =
    "Upravit nastavení archivovaného měsíce?";

  const handleArchiveMonthSummarySettingsEditModalVisibility = () => {
    setShowArchiveMonthSummarySettingsEditModal(
      !showArchiveMonthSummarySettingsEditModal
    );
  };

  const sendDataByEmail = () => {
    const jobsData = jobs.map((oneJob) => {
      return `${getCzDateArchiveJobEmailFormat(oneJob.date)}\u00A0\u00A0${
        oneJob.cmr
      }\u00A0\u00A0${oneJob.city}\u00A0\u00A0${oneJob.zipcode}\u00A0\u00A0${
        oneJob.weight + "t"
      }\u00A0\u00A0${oneJob.price + "€"}`;
    });

    const summaryData = `Fakturace:\u00A0${summaryEur}\u00A0€\u00A0/\u00A0${summaryCzk} Kč\nPrací:\u00A0\u00A0${summaryJobs}\nDruhých prací:\u00A0\u00A0${summarySecondJobs}\nČekání:\u00A0\u00A0${summaryWaiting}`;

    const dataToSend = `${getArchiveDate(date)}\n\n${jobsData.join(
      "\n"
    )}\n\n${summaryData}`;

    const encodedDataToSend = encodeURIComponent(dataToSend);

    const subject = `Souhrn\u00A0prací\u00A0za\u00A0${getArchiveDate(date)}`;

    const mailto = `mailto:?subject=${subject}&body=${encodedDataToSend}`;

    window.location.href = mailto;

    console.log(dataToSend);
  };

  return (
    <section className="archive-month-summary">
      {showArchiveMonthSummarySettingsEditModal && (
        <ModalPrompt
          heading={archiveMonthSummarySettingsEditModal}
          text={""}
          clbFunction={setEditArchiveMonthSummarySettings}
          closeModal={handleArchiveMonthSummarySettingsEditModalVisibility}
        />
      )}
      <div className="archive-month-summary-container">
        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Fakturace:</div>
          <div className="archive-month-summary-item">
            {summaryEur + " €"}
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div></div>
          <div className="archive-month-summary-item">{summaryCzk + " Kč"}</div>
        </div>
        <br />
        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Výplata:</div>
          <div className="archive-month-summary-item">
            {summarySalary + " Kč"}
          </div>
        </div>
        <br />
        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Prací:</div>
          <div className="archive-month-summary-item">{summaryJobs}</div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Druhých prací:</div>
          <div className="archive-month-summary-item">{summarySecondJobs}</div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Čekání:</div>
          <div className="archive-month-summary-item">{summaryWaiting}</div>
        </div>
        <br />
        <br />
        <BsPencil
          onClick={() => setShowArchiveMonthSummarySettingsEditModal(true)}
        />
        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Základ:</div>

          <div className="archive-month-summary-item">
            {summaryBaseMoney + " Kč"}
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">% z fakturace:</div>
          <div className="archive-month-summary-item">
            {summaryPercentage + " %"}
            <span>&nbsp;</span>
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Druhá práce:</div>
          <div className="archive-month-summary-item">
            {summarySecondJobBenefit + " Kč"}
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">
            Čekání - zaměstnavatel (Kč):
          </div>
          <div className="archive-month-summary-item">
            {summaryWaitingBenefitEmployerCzk + " Kč"}
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Čekání (€):</div>
          <div className="archive-month-summary-item">
            {summaryWaitingBenefitEur + " €"}
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Kurz Eur/Kč:</div>
          <div className="archive-month-summary-item">
            {summaryEurCzkRate + " Kč"}
          </div>
        </div>

        <a
          href="#"
          className="archive-month-summary-send-data-by-email"
          onClick={sendDataByEmail}
        >
          Odeslat souhrn emailem
        </a>
      </div>
    </section>
  );
};

export default ArchiveMonthSummary;
