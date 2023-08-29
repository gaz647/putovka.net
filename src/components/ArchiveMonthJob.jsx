/* eslint-disable react/prop-types */
import "./ArchiveMonthJob.css";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalPrompt from "./ModalPrompt";
import {
  setIsEditingArchivedJob,
  setJobToEdit,
  deleteArchiveMonthJobFromDatabase,
  setEditing,
} from "../redux/AuthSlice";

const ArchiveMonthJob = ({ oneJobData }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const {
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
    waiting,
    weight,
    weightTo27t,
    weightTo34t,
    zipcode,
  } = oneJobData;

  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  // EDIT ARCHIVED JOB

  const archiveJobEditModalHeading =
    "Upravit vybranou práci v měsíci z archivu?";

  const [showArchiveJobEditModal, setShowArchiveJobEditModal] = useState(false);

  const handleArchiveJobEditModalVisibility = () => {
    setShowArchiveJobEditModal(!showArchiveJobEditModal);
  };

  const editArchiveMonthJob = () => {
    const archivedJobToEdit = {
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
      waiting,
      weight,
      weightTo27t,
      weightTo34t,
      zipcode,
    };
    dispatch(setIsEditingArchivedJob(true));
    dispatch(setJobToEdit(archivedJobToEdit));
    setShowArchiveJobEditModal(false);
    dispatch(setEditing(true));
    navigate("/edit-job");
  };

  // DELETE ARCHIVED JOB

  const deleteArchiveMonthJob = (idOfJob) => {
    // setShowArchiveModal(!showArchiveModal);

    const tempArchivedJobs = [...archivedJobs];

    const filteredArchivedJobs = tempArchivedJobs.map((oneMonth) => {
      // Zkopírujeme pole jobs a odstraníme z něj položku s odpovídajícím id
      const updatedJobs = oneMonth.jobs.filter((job) => job.id !== idOfJob);

      // Vrátíme aktualizovaný objekt s novým polem jobs
      return { ...oneMonth, jobs: updatedJobs };
    });

    const payload = {
      userUid,
      filteredArchivedJobs,
    };

    dispatch(deleteArchiveMonthJobFromDatabase(payload));
  };

  const archiveJobDeleteModalHeading =
    "Smazat vybranou práci v měsíci z archivu?";

  const archiveJobDeleteModalText = "tuto akci nelze vzít zpět";

  const [showArchiveJobDeleteModal, setShowArchiveJobDeleteModal] =
    useState(false);

  const handleArchiveJobDeleteModalVisibility = () => {
    setShowArchiveJobDeleteModal(!showArchiveJobDeleteModal);
  };

  return (
    <section className="archive-month-job">
      {showArchiveJobEditModal && (
        <ModalPrompt
          heading={archiveJobEditModalHeading}
          text={""}
          clbFunction={editArchiveMonthJob}
          closeModal={handleArchiveJobEditModalVisibility}
        />
      )}
      {showArchiveJobDeleteModal && (
        <ModalPrompt
          heading={archiveJobDeleteModalHeading}
          text={archiveJobDeleteModalText}
          clbFunction={() => deleteArchiveMonthJob(id)}
          closeModal={handleArchiveJobDeleteModalVisibility}
        />
      )}
      <div className="archive-month-job-header">
        <div className="archive-month-job-header-item">
          {getCzDateFormat(date)}
        </div>
        <div className="archive-month-job-header-item">{weight + "t"}</div>
        <div className="archive-month-job-header-item">{price + " €"}</div>
        <div className="archive-month-job-header-item">
          <button onClick={() => setShowArchiveJobEditModal(true)}>edit</button>
        </div>
        <div className="archive-month-job-header-item">
          <button onClick={() => setShowArchiveJobDeleteModal(true)}>x</button>
        </div>
      </div>

      <div>{city}</div>
      <div>{zipcode}</div>
      <div>{cmr}</div>
      <div>{isSecondJob ? "dvojka" : "nedvojka"}</div>
      <div>{waiting}</div>
      <div>{note}</div>
    </section>
  );
};

export default ArchiveMonthJob;
