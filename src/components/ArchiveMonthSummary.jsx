/* eslint-disable react/prop-types */
import "./ArchiveMonthSummary.css";

const ArchiveMonthSummary = ({ summary }) => {
  const {
    summaryEur,
    summaryCzk,
    summarySecondJobs,
    summaryWaiting,
    summarySalary,
    summaryJobs,
  } = summary;

  return (
    <section className="archive-month-summary">
      <div className="archive-month-summary-container">
        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Fakturace</div>
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
          <div className="archive-month-summary-item">Výplata</div>
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
          <div className="archive-month-summary-item">Druhých prací</div>
          <div className="archive-month-summary-item">{summarySecondJobs}</div>
        </div>

        <div className="archive-month-summary-one-line">
          <div className="archive-month-summary-item">Čekání</div>
          <div className="archive-month-summary-item">{summaryWaiting}</div>
        </div>
      </div>
    </section>
  );
};

export default ArchiveMonthSummary;
