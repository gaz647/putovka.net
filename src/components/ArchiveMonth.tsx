/* eslint-disable react/prop-types */
import "./ArchiveMonth.css";
import ArchiveMonthJob from "./ArchiveMonthJob";
import ArchiveMonthSummary from "./ArchiveMonthSummary";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import getArchiveDate from "../customFunctionsAndHooks/getArchiveDate";
import ModalPrompt from "./ModalPrompt";
// import { useSelector, useDispatch } from "react-redux";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { deleteArchiveMonthRedux } from "../redux/AuthSlice";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { JobType, ArchiveType, ArchiveMonthSummaryType } from "../types";

const ArchiveMonth = ({
  oneMonthData,
}: {
  oneMonthData: {
    date: string;
    eurCzkRate: number;
    jobs: JobType[];
  };
}) => {
  const dispatch = useAppDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //
  const { date, eurCzkRate, jobs } = oneMonthData;

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  // USE STATE -----------------------------------------------------------
  //
  const [summaryData, setSummaryData] = useState<ArchiveMonthSummaryType>({
    date: "",
    jobs: [],
    summaryCzk: 0,
    summaryEur: 0,
    summaryEurCzkRate: 0,
    summaryHolidays: 0,
    summaryJobs: 0,
    summarySecondJobs: 0,
    summaryTimeSpent: 0,
    summaryWaiting: 0,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // GET SUMMARY ---------------------------------------------------------
  //
  const getSummary = () => {
    const summaryEur = jobs.reduce(
      (acc, job: { price: number; date: string }) => {
        return acc + job.price;
      },
      0
    );

    const summaryCzk = Math.floor(summaryEur * eurCzkRate);

    const summarySecondJobs = jobs.reduce((acc, job) => {
      return job.isSecondJob ? acc + 1 : acc;
    }, 0);

    const summaryWaiting = jobs.reduce((acc, job) => {
      return acc + job.waiting;
    }, 0);

    const summaryEurCzkRate = eurCzkRate;
    const summaryJobs = jobs.filter((oneJob) => !oneJob.isHoliday).length;
    const summaryHolidays = jobs.filter((oneJob) => oneJob.isHoliday).length;
    const summaryTimeSpent = jobs.reduce((acc, job) => {
      return acc + job.timeSpent;
    }, 0);

    setSummaryData({
      date,
      jobs,
      summaryCzk,
      summaryEur,
      summaryEurCzkRate,
      summaryHolidays,
      summaryJobs,
      summarySecondJobs,
      summaryTimeSpent,
      summaryWaiting,
    });
  };

  // DELETE ARCHIVE MONTH ------------------------------------------------
  //
  const deleteArchiveMonth = (dateOfMonth: string) => {
    // setShowArchiveModal(!showArchiveModal);
    const tempArchivedJobs: ArchiveType[] = [...archivedJobs];

    const filteredArchivedJobs: ArchiveType[] = tempArchivedJobs.filter(
      (oneMonth) => oneMonth.date !== dateOfMonth
    );

    const payload = {
      userUid: userUid || "",
      filteredArchivedJobs: filteredArchivedJobs || [],
    };

    dispatch(deleteArchiveMonthRedux(payload));
  };

  // HANDLE ARCHIVE MODAL VISIBILITY -------------------------------------
  //
  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  // HANDLE SHOW ---------------------------------------------------------
  //
  const handleShow = () => {
    setShowDetails(!showDetails);
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="archive-month">
      {showArchiveModal && (
        <ModalPrompt
          heading={"Smazat vybraný měsíc z archivu?"}
          text={"tuto akci nelze vzít zpět"}
          confirmFunction={() => deleteArchiveMonth(date)}
          declineFunction={handleArchiveModalVisibility}
        />
      )}
      <div className="archive-month-header">
        <div className="archive-month-month-container">
          <div className="archive-month-month">{getArchiveDate(date)}</div>

          <MdOutlineExpandCircleDown
            className={`archive-month-header-expand-btn ${
              showDetails ? "archive-month-header-expand-btn-opened" : ""
            }`}
            onClick={handleShow}
          />
        </div>

        <BsTrash3
          className="archive-month-header-delete-month-btn"
          onClick={() => setShowArchiveModal(true)}
        />
      </div>

      {showDetails && (
        <>
          {jobs.map((oneJob) => {
            return <ArchiveMonthJob key={uuidv4()} oneJobData={oneJob} />;
          })}
        </>
      )}

      <ArchiveMonthSummary summary={summaryData} />
    </section>
  );
};

export default ArchiveMonth;
