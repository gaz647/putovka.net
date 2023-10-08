/* eslint-disable react/prop-types */
import "./ArchiveMonth.css";
import ArchiveMonthJob from "./ArchiveMonthJob";
import ArchiveMonthSummary from "./ArchiveMonthSummary";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import getArchiveDate from "../customFunctionsAndHooks/getArchiveDate";
import ModalPrompt from "./ModalPrompt";
import { useSelector, useDispatch } from "react-redux";
import { deleteArchiveMonthRedux } from "../redux/AuthSlice";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";

const ArchiveMonth = ({ oneMonthData }) => {
  const dispatch = useDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //
  const { date, userSettings, jobs } = oneMonthData;

  // USE SELECTOR --------------------------------------------------------
  //
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  // USE STATE -----------------------------------------------------------
  //
  const [summaryData, setSummaryData] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // GET SUMMARY ---------------------------------------------------------
  //
  const getSummary = () => {
    const summaryEur = jobs.reduce((acc, job) => {
      return acc + job.price;
    }, 0);

    const summaryCzk = parseInt(summaryEur * userSettings.eurCzkRate);

    const summarySecondJobs = jobs.reduce((acc, job) => {
      return job.isSecondJob ? acc + 1 : acc;
    }, 0);

    const summaryWaiting = jobs.reduce((acc, job) => {
      return acc + job.waiting;
    }, 0);

    const summarySalary = parseInt(
      userSettings.baseMoney +
        summaryCzk * (userSettings.percentage * 0.01) +
        summarySecondJobs * userSettings.secondJobBenefit +
        summaryWaiting * userSettings.waitingBenefitEmployerCzk +
        summaryWaiting *
          userSettings.waitingBenefitEur *
          userSettings.eurCzkRate
    );

    const summaryBaseMoney = userSettings.baseMoney;
    const summaryPercentage = userSettings.percentage;
    const summarySecondJobBenefit = userSettings.secondJobBenefit;
    const summaryWaitingBenefitEmployerCzk =
      userSettings.waitingBenefitEmployerCzk;
    const summaryWaitingBenefitEur = userSettings.waitingBenefitEur;
    const summaryEurCzkRate = userSettings.eurCzkRate;
    const summaryJobs = jobs.length;

    setSummaryData({
      date,
      summaryEur,
      summaryCzk,
      summarySecondJobs,
      summaryWaiting,
      summarySalary,
      summaryJobs,
      summaryEurCzkRate,
      summaryBaseMoney,
      summaryPercentage,
      summarySecondJobBenefit,
      summaryWaitingBenefitEmployerCzk,
      summaryWaitingBenefitEur,
      jobs,
    });
  };

  // DELETE ARCHIVE MONTH ------------------------------------------------
  //
  const deleteArchiveMonth = (dateOfMonth) => {
    // setShowArchiveModal(!showArchiveModal);
    const tempArchivedJobs = [...archivedJobs];

    const filteredArchivedJobs = tempArchivedJobs.filter(
      (oneMonth) => oneMonth.date !== dateOfMonth
    );

    const payload = {
      userUid,
      filteredArchivedJobs,
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
