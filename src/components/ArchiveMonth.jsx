/* eslint-disable react/prop-types */
import "./ArchiveMonth.css";
import ArchiveMonthJob from "./ArchiveMonthJob";
import ArchiveMonthSummary from "./ArchiveMonthSummary";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ArchiveMonth = ({ oneMonthData }) => {
  const { date, userSettings, jobs } = oneMonthData;

  //   const [summaryEur, setSummaryEur] = useState(0);
  //   const [summaryCzk, setSummaryCzk] = useState(0);
  //   const [summarySecondJobs, setSummarySecondJobs] = useState(0);
  //   const [summaryWaiting, setSummaryWaiting] = useState();
  //   const [summarySalary, setSummarySalary] = useState(0);
  //   const [summaryJobs, setSummaryJobs] = useState(0);

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

  return (
    <section>
      <h3>{date}</h3>
      <br />
      {jobs.map((oneJob) => {
        return <ArchiveMonthJob key={uuidv4()} oneJobData={oneJob} />;
      })}
      <ArchiveMonthSummary summary={summaryData} />
    </section>
  );
};

export default ArchiveMonth;
