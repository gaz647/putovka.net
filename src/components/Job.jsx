import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteJobFromDatabase } from "../redux/JobsSlice";

import "./Job.css";

// eslint-disable-next-line react/prop-types
const Job = ({ jobDetails }) => {
  // eslint-disable-next-line react/prop-types
  const { city, cmr, date, day, id, price, zipcode } = jobDetails;

  const dispatch = useDispatch();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const deleteJob = () => {
    const jobId = id;
    const payload = { userUid, jobId };
    if (confirm("Smazat práci?")) {
      dispatch(deleteJobFromDatabase(payload));
    }
  };

  return (
    <div className="one-job">
      <div className="one-job-header">
        <div>{day}</div>
        <div>{date}</div>
        <div>{price + " eur"}</div>
        <div className="delete-job-btn" onClick={deleteJob}>
          o
        </div>
      </div>
      <div className="one-job-details">
        <div className="one-job-cmr">{cmr}</div>
        <div className="one-job-city">{city}</div>
        <div className="one-job-zip">{zipcode}</div>
      </div>
    </div>
  );
};

export default Job;
