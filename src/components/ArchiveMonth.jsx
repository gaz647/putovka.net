/* eslint-disable react/prop-types */
import "./ArchiveMonth.css";
import ArchiveMonthJob from "./ArchiveMonthJob";
import ArchiveMonthSummary from "./ArchiveMonthSummary";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import getArchiveDate from "../customFunctionsAndHooks/getArchiveDate";

const ArchiveMonth = ({ oneMonthData }) => {
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

    const summaryJobs = jobs.length;

    setSummaryData({
      summaryEur,
      summaryCzk,
      summarySecondJobs,
      summaryWaiting,
      summarySalary,
      summaryJobs,
    });
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  const deleteArchiveMonth = (date) => {
    const filteredArchivedJobs = archivedJobs.filter((oneMonth) => {
      return oneMonth.date !== date;
    });
    console.log(filteredArchivedJobs);
  };

  return (
    <section className="archive-month">
      <div className="archive-month-month">{getArchiveDate(date)}</div>
      <button>x</button>
      {jobs.map((oneJob) => {
        return <ArchiveMonthJob key={uuidv4()} oneJobData={oneJob} />;
      })}
      <ArchiveMonthSummary summary={summaryData} />
    </section>
  );
};

export default ArchiveMonth;
