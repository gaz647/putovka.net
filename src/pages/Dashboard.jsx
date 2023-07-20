import "./Dashboard.css";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { onSnapshot, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const jobDetails = {
  day: "Po",
  date: "19.06.2023",
  price: "300 €",
};

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
            <p>p</p>
            <br />
            <p>p</p>
          </div>
          <div className="dashboard-summary-invoicing-right">
            <p>p</p>
            <br />
            <p>p</p>
          </div>
        </div>
        <div className="dashboard-summary-counts">
          <div>o</div>
          <div>o</div>
          <div>o</div>
        </div>
      </section>
      <section className="dashboard-jobs wrapper">
        <Job jobDetails={jobDetails} />
        <Job jobDetails={jobDetails} />
        {currentJobs.map((oneJob) => {
          return <p key={oneJob.city}>{oneJob.city}</p>;
        })}
        <Link to={"/test"}>Test page</Link>
      </section>
    </>
  );
};

export default Dashboard;
