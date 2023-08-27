/* eslint-disable react/prop-types */
import "./ArchiveMonthJob.css";

const ArchiveMonthJob = ({ oneJobData }) => {
  const { date, city, zipcode, price, isSecondJob, waiting } = oneJobData;
  return (
    <section>
      <h3>{date}</h3>
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
