/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteJobFromDatabase, setJobToEdit } from "../redux/JobsSlice";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { FcExpand } from "react-icons/fc";
import { PiNumberSquareTwoBold } from "react-icons/pi";
import "./Job.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Job = ({ jobDetails }) => {
  const {
    city,
    cmr,
    date,
    day,
    id,
    isSecondJob,
    note,
    price,
    terminal,
    waiting,
    weight,
    zipcode,
  } = jobDetails;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const deleteJob = () => {
    const jobId = id;
    const payload = { userUid, jobId };
    if (confirm("Smazat práci?")) {
      dispatch(deleteJobFromDatabase(payload));
    }
  };

  const editJobNavigate = () => {
    const jobToEdit = {
      city,
      cmr,
      date,
      day,
      id,
      isSecondJob,
      note,
      price,
      terminal,
      waiting: Number(waiting),
      weight,
      zipcode,
    };
    console.log("jobToEdit", jobToEdit);
    dispatch(setJobToEdit(jobToEdit));
    navigate("/edit-job");
  };

  const displayCZdateFormat = (date) => {
    return date.split("-").reverse().join(".");
  };

  const [showDetails, setShowDetails] = useState(false);

  const handleShow = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="one-job">
      <div className="one-job-header">
        <BsPencil onClick={editJobNavigate} />
        <div>{day}</div>
        <div>{displayCZdateFormat(date)}</div>
        <div>{price + " €"}</div>
        <div className="delete-job-btn-container">
          <BsTrash3 onClick={deleteJob} />
          <FcExpand className={`expand-btn ${showDetails ? "opened" : ""}`} />
        </div>
      </div>
      <div className="one-job-details" onClick={handleShow}>
        <div className="one-job-body-preview">
          <div className="one-job-body-preview-item-city">{city}</div>
          <div className="one-job-body-preview-item-zipcode">{zipcode}</div>
        </div>
        {showDetails && (
          <div className="one-job-body-content">
            <div className="one-job-body-content-item-cmr">{cmr}</div>
            <div className="one-job-body-content-item-terminal">
              {"terminál: " + terminal}
            </div>
            <div className="one-job-body-content-item-note">
              {note !== "" ? <div>&#40;{note}&#41;</div> : ""}
            </div>
          </div>
        )}
      </div>
      <div className="one-job-footer">
        <div>
          {isSecondJob ? (
            <PiNumberSquareTwoBold className="one-job-footer-second-job-icon" />
          ) : (
            ""
          )}
        </div>
        <div className="one-job-footer-weight">{weight + "t"}</div>
        <div>
          {waiting > 0 ? (
            <div className="one-job-footer-waiting-icon">{waiting}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;
