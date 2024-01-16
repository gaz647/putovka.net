import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
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
import { FaUmbrellaBeach } from "react-icons/fa";
import "./Job.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";

type JobType = {
  city: string;
  cmr: string;
  date: string;
  day: string;
  id: string;
  isCustomJob: boolean;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  terminal: string;
  timestamp: number;
  waiting: number;
  weight: number;
  weightTo27t: number;
  weightTo34t: number;
  zipcode: string;
};

const Job = ({ jobDetails }: { jobDetails: JobType }) => {
  const dispatch = useAppDispatch();
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
    isHoliday,
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
  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);
  const currentJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

  const waitingBenefitEur = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.waitingBenefitEur
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

    const payload = { userUid: userUid || "", filteredCurrentJobs };
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
      isHoliday,
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
    !isHoliday ? setShowDetails(!showDetails) : null;
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
    let textToCopy;
    if (!isHoliday) {
      textToCopy = `${getCzDateFormat(date)} ${cmr} ${city} ${zipcode} ${
        weight + "t"
      } ${price + "€"}`;
    } else if (isHoliday) {
      textToCopy = `${getCzDateFormat(date)} ${city}`;
    }

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
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
    }
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
        <div className="one-job-edit-delete-second-job-waiting-btn-container one-job-header-edit-btn">
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
            {!isHoliday
              ? (price + waiting * waitingBenefitEur).toLocaleString() + " €"
              : ""}
          </div>
        </div>

        <div className="one-job-edit-delete-second-job-waiting-btn-container one-job-header-delete-btn">
          <BsTrash3 onClick={handleDeleteJobModalVisibility} />
        </div>
        {!isHoliday && (
          <div className="one-job-header-expand-btn">
            <FcExpand
              className={` ${
                showDetails ? "one-job-header-expand-btn-opened" : ""
              }`}
            />
          </div>
        )}
      </div>

      <div className="one-job-body" onClick={handleShowDetails}>
        <div className="one-job-body-item one-job-body-city">{city}</div>

        <div className="one-job-body-item one-job-body-item-smaller">
          {zipcode}
        </div>

        {showDetails && (
          <>
            {cmr && (
              <div className="one-job-body-item one-job-body-item-smaller">
                {cmr}
              </div>
            )}

            <div className="one-job-body-item one-job-body-item-smaller">
              {"terminál: " + terminal}
            </div>

            {note && (
              <div className="one-job-body-item one-job-body-item-smaller">
                {note}
              </div>
            )}
          </>
        )}
      </div>

      <div className="one-job-footer">
        <div className="one-job-edit-delete-second-job-waiting-btn-container one-job-footer-btn">
          {isHoliday ? (
            <FaUmbrellaBeach />
          ) : (
            <PiNumberSquareTwoBold
              className={isSecondJob ? "" : "vis-hidden"}
            />
          )}
        </div>

        <div className="one-job-body-item one-job-body-item-smaller">
          {isHoliday ? note : weight + "t"}
        </div>

        <div
          className={`one-job-edit-delete-second-job-waiting-btn-container one-job-footer-btn ${
            waiting < 1 ? "vis-hidden" : ""
          }`}
        >
          <PiClockBold />
          {waiting}
        </div>
      </div>
    </div>
  );
};

export default Job;
