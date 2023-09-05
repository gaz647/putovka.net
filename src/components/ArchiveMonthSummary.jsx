/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ArchiveMonthSummary.css";
import ModalPrompt from "./ModalPrompt";
import { BsPencil } from "react-icons/bs";
import { setArchiveMonthSummarySettingsToEdit } from "../redux/AuthSlice";

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
    dispatch(setArchiveMonthSummarySettingsToEdit(payload));
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
      </div>
    </section>
  );
};

export default ArchiveMonthSummary;
