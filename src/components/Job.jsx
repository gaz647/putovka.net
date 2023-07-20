import "./Job.css";

// eslint-disable-next-line react/prop-types
const Job = ({ jobDetails }) => {
  // eslint-disable-next-line react/prop-types
  const { day, date, price } = jobDetails;

  return (
    <div className="one-job">
      <div className="one-job-header">
        <div>{day}</div>
        <div>{date}</div>
        <div>{price}</div>
        <div>o</div>
      </div>
      <div className="one-job-details">
        <div className="one-job-cmr">CTR2023000003</div>
        <div className="one-job-city">Veverska Bityska</div>
        <div className="one-job-zip">66471</div>
      </div>
    </div>
  );
};

export default Job;
