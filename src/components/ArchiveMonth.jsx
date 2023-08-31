/* eslint-disable react/prop-types */
import "./ArchiveMonth.css";
import ArchiveMonthJob from "./ArchiveMonthJob";
import ArchiveMonthSummary from "./ArchiveMonthSummary";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import getArchiveDate from "../customFunctionsAndHooks/getArchiveDate";
import ModalPrompt from "./ModalPrompt";
import { useSelector, useDispatch } from "react-redux";
import { deleteArchiveMonthFromDatabase } from "../redux/AuthSlice";

const ArchiveMonth = ({ oneMonthData }) => {
  const dispatch = useDispatch();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const { date, userSettings, jobs } = oneMonthData;

  const [summaryData, setSummaryData] = useState({});

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
        summaryWaiting * userSettings.waitingBenefit
    );

    const summaryEurCzkRate = userSettings.eurCzkRate;

    const summaryJobs = jobs.length;

    setSummaryData({
      summaryEur,
      summaryCzk,
      summarySecondJobs,
      summaryWaiting,
      summarySalary,
      summaryJobs,
      summaryEurCzkRate,
    });
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

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

    dispatch(deleteArchiveMonthFromDatabase(payload));
  };

  const archiveModalHeading = "Smazat vybraný měsíc z archivu?";

  const archiveModalText = "tuto akci nelze vzít zpět";

  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  return (
    <section className="archive-month">
      {showArchiveModal && (
        <ModalPrompt
          heading={archiveModalHeading}
          text={archiveModalText}
          clbFunction={() => deleteArchiveMonth(date)}
          closeModal={handleArchiveModalVisibility}
        />
      )}
      <div className="archive-month-month">{getArchiveDate(date)}</div>
      <button onClick={() => setShowArchiveModal(true)}>x</button>

      {jobs.map((oneJob) => {
        return <ArchiveMonthJob key={uuidv4()} oneJobData={oneJob} />;
      })}
      <ArchiveMonthSummary summary={summaryData} />
    </section>
  );
};

export default ArchiveMonth;
