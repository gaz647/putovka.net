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

  useEffect(() => {
    const unsub = onSnapshot(doc(db, `users/${loggedInUserUid}`), (doc) => {
      setCurrentJobs(doc.data().currentJobs);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("currentJobs", currentJobs);

  return (
    <>
      <section className="dashboard wrapper">
        <div className="dashboard-summary-invoicing">
          <div className="dashboard-summary-invoicing-left">
            <p>Fakturace €</p>
            <br />
            <p>Fakturace CZK</p>
          </div>
          <div className="dashboard-summary-invoicing-right">
            <p>Výplata</p>
            <br />
            <p>38 600 Kč</p>
          </div>
        </div>
        <div className="dashboard-summary-counts">
          <div className="dashboard-summary-counts-container">
            <PiTruck className="dashboard-summary-counts-icon" />
            <div>20</div>
          </div>
          <div className="dashboard-summary-counts-container">
            <PiNumberSquareTwoBold className="dashboard-summary-counts-icon" />
            <div>3</div>
          </div>
          <div className="dashboard-summary-counts-container">
            <PiClockBold className="dashboard-summary-counts-icon" />
            <div>5</div>
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
