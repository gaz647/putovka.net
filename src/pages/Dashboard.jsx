import "./Dashboard.css";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { onSnapshot, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { PiTruck, PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";

const Dashboard = () => {
  const [currentJobs, setCurrentJobs] = useState([]);

  const loggedInUserUid = useSelector((state) => state.auth.loggedInUserUid);
  console.log(loggedInUserUid);

  const [totalEur, setTotalEur] = useState(0);
  const [totalCzk, setTotalCzk] = useState(0);
  const [salary, setSalary] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalSecondJobs, setTotalSecondJobs] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);

  const baseMoney = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.baseMoney
  );

  const percentage = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.percentage
  );

  const secondJobBenefit = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.secondJobBenefit
  );

  const waitingBenefit = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.waitingBenefit
  );

  useEffect(() => {
    const unsub = onSnapshot(doc(db, `users/${loggedInUserUid}`), (doc) => {
      setCurrentJobs(doc.data().currentJobs);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTotalJobs(currentJobs.length);
    setTotalSecondJobs(
      currentJobs.filter((oneJob) => oneJob.isSecondJob === true).length
    );
    setTotalWaiting(
      currentJobs.reduce((acc, oneJob) => {
        return acc + Number(oneJob.waiting);
      }, 0)
    );
    setTotalEur(
      currentJobs.reduce((acc, oneJob) => {
        return acc + Number(oneJob.price);
      }, 0)
    );
    setTotalCzk(totalEur * 27);

    setSalary(
      parseInt(
        baseMoney +
          totalCzk * (percentage * 0.01) +
          totalSecondJobs * secondJobBenefit +
          totalWaiting * waitingBenefit
      )
    );
  }, [
    currentJobs,
    totalEur,
    baseMoney,
    totalCzk,
    percentage,
    totalSecondJobs,
    secondJobBenefit,
    totalWaiting,
    waitingBenefit,
  ]);

  return (
    <>
      <section className="dashboard wrapper">
        <div className="dashboard-summary-invoicing">
          <div className="dashboard-summary-invoicing-left">
            <div>{totalEur + " €"}</div>
            <br />

            <div>{totalCzk + " Kč"}</div>
          </div>
          <div className="dashboard-summary-invoicing-right">
            <p>Výplata</p>
            <br />
            <div>{salary + " Kč"}</div>
          </div>
        </div>
        <div className="dashboard-summary-counts">
          <div className="dashboard-summary-counts-container">
            <PiTruck className="dashboard-summary-counts-icon" />
            <div>{totalJobs}</div>
          </div>
          <div className="dashboard-summary-counts-container">
            <PiNumberSquareTwoBold className="dashboard-summary-counts-icon" />
            <div>{totalSecondJobs}</div>
          </div>
          <div className="dashboard-summary-counts-container">
            <PiClockBold className="dashboard-summary-counts-icon" />
            <div>{totalWaiting}</div>
          </div>
        </div>
      </section>
      <section className="dashboard-jobs wrapper">
        {currentJobs.map((oneJob) => {
          return <Job key={oneJob.id} jobDetails={oneJob} />;
        })}
        <Link to={"/test"}>Test page</Link>
      </section>
    </>
  );
};

export default Dashboard;
