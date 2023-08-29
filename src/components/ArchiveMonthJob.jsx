/* eslint-disable react/prop-types */
import "./ArchiveMonthJob.css";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";

const ArchiveMonthJob = ({ oneJobData }) => {
  const {
    date,
    weight,
    price,
    cmr,
    city,
    zipcode,
    isSecondJob,
    waiting,
    note,
  } = oneJobData;
  return (
    <section className="archive-month-job">
      <div className="archive-month-job-header">
        <div className="archive-month-job-header-item">
          {getCzDateFormat(date)}
        </div>
        <div className="archive-month-job-header-item">{weight + "t"}</div>
        <div className="archive-month-job-header-item">{price + " €"}</div>
        <div className="archive-month-job-header-item">
          <button>x</button>
        </div>
      </div>

      <div>{city}</div>
      <div>{zipcode}</div>
      <div>{cmr}</div>
      <div>{isSecondJob ? "dvojka" : "nedvojka"}</div>
      <div>{waiting}</div>
      <div>{note}</div>
    </section>
  );
};

export default ArchiveMonthJob;
