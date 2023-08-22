/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteJobFromDatabase,
  setEditing,
  setJobToEdit,
} from "../redux/JobsSlice";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { FcExpand } from "react-icons/fc";
import { PiNumberSquareTwoBold } from "react-icons/pi";
import "./Job.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";

const Job = ({ jobDetails }) => {
  const {
    city,
    cmr,
    date,
    day,
    id,
    isCustomJob,
    isSecondJob,
    note,
    price,
    terminal,
    timestamp,
    waiting,
    weight,
    weightTo27t,
    weightTo34t,
    zipcode,
  } = jobDetails;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const deleteJob = () => {
    const jobId = id;
    const payload = { userUid, jobId };
    dispatch(deleteJobFromDatabase(payload));
  };

  const editJobNavigate = () => {
    const jobToEdit = {
      city,
      cmr,
      date,
      day,
      id,
      isCustomJob,
      isSecondJob,
      note,
      price,
      terminal,
      timestamp,
      waiting: Number(waiting),
      weight,
      weightTo27t,
      weightTo34t,
      zipcode,
    };

    dispatch(setJobToEdit(jobToEdit));
    dispatch(setEditing(true));
    navigate("/edit-job");
  };

  const displayCZdateFormat = (date) => {
    return date.split("-").reverse().join(".");
  };

  const [showDetails, setShowDetails] = useState(false);

  const handleShow = () => {
    setShowDetails(!showDetails);
  };

  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);

  const deleteJobModalHeading = "Odstranit vybranou práci?";

  const handleDeleteJobModalVisibility = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  return (
    <div className="one-job">
      {showDeleteJobModal && (
        <ModalPrompt
          heading={deleteJobModalHeading}
          text={""}
          clbFunction={deleteJob}
          closeModal={handleDeleteJobModalVisibility}
        />
      )}
      <div className="one-job-header">
        <BsPencil onClick={editJobNavigate} />
        <div>{day}</div>
        <div>{displayCZdateFormat(date)}</div>
        <div>{weight + "t"}</div>
        <div>{price + " €"}</div>
        <div className="delete-job-btn-container">
          <BsTrash3 onClick={handleDeleteJobModalVisibility} />
          <FcExpand className={`expand-btn ${showDetails ? "opened" : ""}`} />
        </div>
      </div>

      <div className="one-job-body-container" onClick={handleShow}>
        <div className="one-job-body-item one-job-body-city">{city}</div>
        <div className="one-job-body-item one-job-body-zipcode">{zipcode}</div>

        {showDetails && (
          <>
            {cmr !== "" ? (
              <div className="one-job-body-hidden-item one-job-body-cmr">
                {cmr}
              </div>
            ) : null}

            <div className="one-job-body-hidden-item one-job-body-terminal">
              {"terminál: " + terminal}
            </div>
            {note !== "" ? (
              <div className="one-job-body-hidden-item one-job-body-note">
                {note}
              </div>
            ) : null}
          </>
        )}

        {isSecondJob ? (
          <PiNumberSquareTwoBold className="one-job-body-second-job-icon" />
        ) : (
          ""
        )}

        {waiting > 0 ? (
          <div className="one-job-body-waiting-icon">{waiting}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Job;
