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
    <section>
      <div>____________________________</div>
      <h1>Souhrn</h1>
      <p>{"Eur: " + summaryEur}</p>
      <p>{"Kč: " + summaryCzk}</p>
      <p>{"Prací: " + summaryJobs}</p>
      <p>{"Dvojek: " + summarySecondJobs}</p>
      <p>{"Čekání: " + summaryWaiting}</p>
      <p>{"Výplata: " + summarySalary}</p>
      <div>____________________________</div>
      <br />
      <br />
      <br />
      <br />
    </section>
  );
};

export default ArchiveMonthSummary;
