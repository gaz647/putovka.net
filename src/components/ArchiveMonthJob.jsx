/* eslint-disable react/prop-types */
import "./ArchiveMonthJob.css";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";

const ArchiveMonthJob = ({ oneJobData }) => {
  const { date, city, zipcode, price, isSecondJob, waiting } = oneJobData;
  return (
    <section>
      <h3>{getCzDateFormat(date)}</h3>
      <button>delete JOB</button>
      <p>{city}</p>
      <p>{zipcode}</p>
      <p>{price}</p>
      <p>{isSecondJob}</p>
      <p>{waiting}</p>
      <br />
    </section>
  );
};

export default ArchiveMonthJob;
