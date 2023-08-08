import "./Job.css";

// eslint-disable-next-line react/prop-types
const Job = ({ jobDetails }) => {
  // eslint-disable-next-line react/prop-types
  const { day, date, price, cmr, city, zip } = jobDetails;

  return (
    <div className="one-job">
      <div className="one-job-header">
        <div>{day}</div>
        <div>{date}</div>
        <div>{price + " eur"}</div>
        <div>o</div>
      </div>
      <div className="one-job-details">
        <div className="one-job-cmr">{cmr}</div>
        <div className="one-job-city">{city}</div>
        <div className="one-job-zip">{zip}</div>
      </div>
    </div>
  );
};

export default Job;
