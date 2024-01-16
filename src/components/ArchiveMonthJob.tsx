/* eslint-disable react/prop-types */
import "./ArchiveMonthJob.css";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";
import {
  setIsEditingArchivedJobTrueRedux,
  setJobToEditRedux,
  deleteArchiveMonthJobRedux,
  setIsEditingTrueRedux,
} from "../redux/AuthSlice";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import { FaUmbrellaBeach } from "react-icons/fa";

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

const ArchiveMonthJob = ({ oneJobData }: { oneJobData: JobType }) => {
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
  } = oneJobData;

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const waitingBenefitEur = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.waitingBenefitEur
  );

  // USE STATE -----------------------------------------------------------
  //
  const [showArchiveJobEditModal, setShowArchiveJobEditModal] = useState(false);
  const [showArchiveJobDeleteModal, setShowArchiveJobDeleteModal] =
    useState(false);

  // HANDLE ARCHVIE JOB EDIT MODAL VISIBILITY ----------------------------
  //
  const handleArchiveJobEditModalVisibility = () => {
    setShowArchiveJobEditModal(!showArchiveJobEditModal);
  };

  // EDIT ARCHIVE MONTH JOB ----------------------------------------------
  //
  const editArchiveMonthJob = () => {
    const archivedJobToEdit = {
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
    };
    dispatch(setIsEditingArchivedJobTrueRedux());
    dispatch(setJobToEditRedux(archivedJobToEdit));
    setShowArchiveJobEditModal(false);
    dispatch(setIsEditingTrueRedux());
    navigate("/edit-job");
  };

  // DELETE ARCHIVED JOB -------------------------------------------------
  //
  const deleteArchiveMonthJob = (idOfJob: string) => {
    const tempArchivedJobs = [...archivedJobs];

    const filteredArchivedJobs = tempArchivedJobs.map((oneMonth) => {
      // Zkopírujeme pole jobs a odstraníme z něj položku s odpovídajícím id
      const updatedJobs = oneMonth.jobs.filter(
        (job: JobType) => job.id !== idOfJob
      );

      // Vrátíme aktualizovaný objekt s novým polem jobs
      return { ...oneMonth, jobs: updatedJobs };
    });

    const payload = {
      userUid: userUid || "",
      filteredArchivedJobs,
    };

    dispatch(deleteArchiveMonthJobRedux(payload));
  };

  // HANDLE ARCHIVE JOB DELETE MODAL VISIBILITIY -------------------------
  //
  const handleArchiveJobDeleteModalVisibility = () => {
    setShowArchiveJobDeleteModal(!showArchiveJobDeleteModal);
  };

  // USE EFFECT ----------------------------------------------------------
  //

  return (
    <section className="archive-month-job">
      {showArchiveJobEditModal && (
        <ModalPrompt
          heading={"Upravit vybranou práci v měsíci z archivu?"}
          confirmFunction={editArchiveMonthJob}
          declineFunction={handleArchiveJobEditModalVisibility}
        />
      )}
      {showArchiveJobDeleteModal && (
        <ModalPrompt
          heading={"Smazat vybranou práci v měsíci z archivu?"}
          text={"tuto akci nelze vzít zpět"}
          confirmFunction={() => deleteArchiveMonthJob(id)}
          declineFunction={handleArchiveJobDeleteModalVisibility}
        />
      )}
      <div className="archive-month-job-header">
        <div className="archive-month-job-header-item">
          <BsPencil onClick={() => setShowArchiveJobEditModal(true)} />
        </div>
        <div className="archive-month-job-header-day">{day}</div>
        <div className="archive-month-job-header-date">
          {getCzDateFormat(date)}
        </div>
        <div className="archive-month-job-header-item">
          {!isHoliday ? weight + "t" : "-------"}
        </div>
        <div className="archive-month-job-header-item">
          {!isHoliday
            ? (price + waiting * waitingBenefitEur).toLocaleString() + " €"
            : "-------"}
        </div>

        <div className="archive-month-job-header-item">
          <BsTrash3 onClick={() => setShowArchiveJobDeleteModal(true)} />
        </div>
      </div>

      <div>{city}</div>
      <div>{zipcode}</div>
      <div>{cmr}</div>
      {isSecondJob && (
        <PiNumberSquareTwoBold className="archive-month-job-second-job-icon" />
      )}

      {waiting > 0 && (
        <div className="archive-month-job-second-waiting-icon-container">
          <PiClockBold />
          <div className="archive-month-job-second-waiting-count">
            {waiting}
          </div>
        </div>
      )}

      <div>{note}</div>
      {isHoliday && (
        <FaUmbrellaBeach className="archive-month-holiday-job-icon" />
      )}
    </section>
  );
};

export default ArchiveMonthJob;
