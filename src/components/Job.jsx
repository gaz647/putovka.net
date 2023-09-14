/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteJobFromDatabase,
  setIsEditingArchivedJob,
  setEditing,
  setJobToEdit,
  runToast,
} from "../redux/AuthSlice";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { FcExpand } from "react-icons/fc";
import { PiNumberSquareTwoBold } from "react-icons/pi";
import "./Job.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";

const Job = ({ jobDetails }) => {
  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

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
    const tempCurrentJobs = [...currentJobs];

    const jobId = id;

    const filteredCurrentJobs = tempCurrentJobs.filter(
      (oneJob) => oneJob.id !== jobId
    );

    const payload = { userUid, filteredCurrentJobs };
    dispatch(deleteJobFromDatabase(payload));
  };

  const editJobNavigate = () => {
    const jobToEdit = {
      city,
      cmr,
      date,
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
    dispatch(setIsEditingArchivedJob(false));
    dispatch(setJobToEdit(jobToEdit));
    dispatch(setEditing(true));
    navigate("/edit-job");
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

  const copyToClipBoard = () => {
    const textToCoppy = `${getCzDateFormat(date)} ${cmr} ${city} ${zipcode} ${
      weight + "t"
    } ${price + "€"}`;

    navigator.clipboard
      .writeText(textToCoppy)
      .then(() => {
        dispatch(
          runToast({
            message: "Zkopírováno do schránky",
            style: "success",
            time: 3000,
          })
        );
      })
      .catch(() => {
        dispatch(
          runToast({
            message: "Zkopírování do schránky se nepovedlo. Zkuste to znovu",
            style: "error",
            time: 3000,
          })
        );
      });
    console.log(textToCoppy);
  };

  return (
    <div className="one-job">
      {showDeleteJobModal && (
        <ModalPrompt
          heading={deleteJobModalHeading}
          text={""}
          confirmFunction={deleteJob}
          declineFunction={handleDeleteJobModalVisibility}
        />
      )}
      <div className="one-job-header">
        <div className="one-job-header-edit-btn">
          <BsPencil onClick={editJobNavigate} />
        </div>
        <div
          className="one-job-header-copy-to-clipboard-container"
          onClick={copyToClipBoard}
        >
          <div>{day}</div>
          <div>{getCzDateFormat(date)}</div>
          <div>{weight + "t"}</div>
          <div>{price + " €"}</div>
        </div>

        <div className="one-job-header-delete-btn">
          <BsTrash3 onClick={handleDeleteJobModalVisibility} />
          <FcExpand
            className={`one-job-expand-btn ${
              showDetails ? "one-job-expand-btn-opened" : ""
            }`}
          />
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
