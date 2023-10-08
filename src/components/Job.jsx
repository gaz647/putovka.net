/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteJobRedux,
  setIsEditingArchivedJobFalseRedux,
  setIsEditingTrueRedux,
  setJobToEditRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { FcExpand } from "react-icons/fc";
import { PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import "./Job.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";

const Job = ({ jobDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //
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

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

  // USE STATE -----------------------------------------------------------
  //
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);

  // DELETE JOB ----------------------------------------------------------
  //
  const deleteJob = () => {
    const tempCurrentJobs = [...currentJobs];

    const jobId = id;

    const filteredCurrentJobs = tempCurrentJobs.filter(
      (oneJob) => oneJob.id !== jobId
    );

    const payload = { userUid, filteredCurrentJobs };
    dispatch(deleteJobRedux(payload));
  };

  // EDIT JOB NAVIGATE ---------------------------------------------------
  //
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
    dispatch(setIsEditingArchivedJobFalseRedux());
    dispatch(setJobToEditRedux(jobToEdit));
    dispatch(setIsEditingTrueRedux());
    navigate("/edit-job");
  };

  // HANDLE SHOW DETAILS -------------------------------------------------
  //
  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  // MODAL STUFF ---------------------------------------------------------
  //
  const deleteJobModalHeading = "Odstranit vybranou práci?";

  const handleDeleteJobModalVisibility = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  // COPY TO CLIPBOARD ---------------------------------------------------
  //
  const copyToClipBoard = () => {
    const textToCoppy = `${getCzDateFormat(date)} ${cmr} ${city} ${zipcode} ${
      weight + "t"
    } ${price + "€"}`;

    navigator.clipboard
      .writeText(textToCoppy)
      .then(() => {
        dispatch(
          runToastRedux({
            message: "Zkopírováno do schránky",
            style: "success",
            time: 3000,
          })
        );
      })
      .catch(() => {
        dispatch(
          runToastRedux({
            message: "Zkopírování do schránky se nepovedlo. Zkuste to znovu",
            style: "error",
            time: 3000,
          })
        );
      });
    console.log(textToCoppy);
  };

  // USE EFFECT ----------------------------------------------------------
  //

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
          <div className="one-job-header-copy-to-clipboard-item">{day}</div>
          <div className="one-job-header-copy-to-clipboard-item">
            {getCzDateFormat(date)}
          </div>
          <div className="one-job-header-copy-to-clipboard-item">
            {price + " €"}
          </div>
        </div>

        <div className="one-job-header-delete-btn">
          <BsTrash3 onClick={handleDeleteJobModalVisibility} />
        </div>

        <div className="one-job-header-expand-btn">
          <FcExpand
            className={` ${
              showDetails ? "one-job-header-expand-btn-opened" : ""
            }`}
          />
        </div>
      </div>

      <div className="one-job-body-container" onClick={handleShowDetails}>
        <div className="one-job-body-item one-job-body-city">{city}</div>
        <div className="one-job-body-item one-job-body-item-smaller">
          {zipcode}
        </div>

        <div className="one-job-body-bottom-line-container">
          <div
            className={`one-job-body-bottom-line-second-job-icon ${
              showDetails && "vis-hidden"
            }`}
          >
            <PiNumberSquareTwoBold
              className={!isSecondJob ? "vis-hidden" : ""}
            />
          </div>

          <div className="one-job-body-item one-job-body-item-smaller">
            {weight + "t"}
          </div>

          <div
            className={`one-job-body-bottom-line-waiting-container ${
              showDetails && "vis-hidden"
            }`}
          >
            <div className={waiting < 1 ? "vis-hidden" : ""}>
              <div className="one-job-body-bottom-line-waiting-icon">
                <PiClockBold />
              </div>
              {waiting}
            </div>
          </div>
        </div>

        {showDetails && (
          <>
            {cmr !== "" ? (
              <div className="one-job-body-item one-job-body-item-smaller">
                {cmr}
              </div>
            ) : null}

            <div className="one-job-body-item one-job-body-item-smaller">
              {"terminál: " + terminal}
            </div>

            <div className="one-job-body-bottom-line-container">
              <div className="one-job-body-bottom-line-second-job-icon">
                <PiNumberSquareTwoBold
                  className={!isSecondJob ? "vis-hidden" : ""}
                />
              </div>

              <div className="one-job-body-item one-job-body-item-smaller">
                {note}
              </div>

              <div className="one-job-body-bottom-line-waiting-container">
                <div className={waiting < 1 ? "vis-hidden" : ""}>
                  <div className="one-job-body-bottom-line-waiting-icon">
                    <PiClockBold />
                  </div>
                  {waiting}
                </div>
              </div>
            </div>
          </>
        )}

        {/* {isSecondJob ? (
          <PiNumberSquareTwoBold className="one-job-body-second-job-icon" />
        ) : (
          ""
        )}

        {waiting > 0 ? (
          <div className="one-job-body-waiting-container">
            <PiClockBold className="one-job-body-waiting-icon" />
            {waiting}
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default Job;
