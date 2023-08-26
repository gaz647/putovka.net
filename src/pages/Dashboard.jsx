import "./Dashboard.css";
import ModalPrompt from "../components/ModalPrompt";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { onSnapshot, doc } from "firebase/firestore";
import { PiTruck, PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";

const Dashboard = () => {
  const [currentJobs, setCurrentJobs] = useState([]);

  const loggedInUserUid = useSelector((state) => state.auth.loggedInUserUid);

  const [totalEur, setTotalEur] = useState(0);
  const [totalCzk, setTotalCzk] = useState(0);
  const [salary, setSalary] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalSecondJobs, setTotalSecondJobs] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);

  const baseMoney = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.baseMoney
  );

  const eurCzkRate = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.eurCzkRate
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
    setTotalCzk(parseInt(totalEur * eurCzkRate));

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
    eurCzkRate,
    totalEur,
    baseMoney,
    totalCzk,
    percentage,
    totalSecondJobs,
    secondJobBenefit,
    totalWaiting,
    waitingBenefit,
  ]);

  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const archiveModalHeading =
    "Archivovat práce z posledního měsíce ve Vašem výpisu? ";

  const archiveModalText = "tento krok nelze vrátit";

  const handleArchiveJobs = () => {
    console.log("archivovat");
    setShowArchiveModal(!showArchiveModal);
    const dateForArchiving = currentJobs[currentJobs.length - 1].date;
    console.log(
      "dateForArchiving - datum poslední práce v currentJobs",
      dateForArchiving
    );
    const transformedDateForArchiving = dateForArchiving.slice(0, -2) + "01";
    console.log(
      "transformedDateForArchivin - upravené datum poslední práce v currentJobs",
      transformedDateForArchiving
    );
  };

  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  // const archiveMonthTemplate = {
  //   month: "08-2023",
  //   jobs: [],
  //   summary: {
  //     jobs: 0,
  //     eur: 0,
  //     czk: 0,
  //     secondJobs: 0,
  //     waiting: 0,
  //     eurCzkRate: 0,
  //     percentage: 0,
  //     salary: 0,
  //   },
  // };

  return (
    <section className="wrapper relative">
      <section className="dashboard">
        {showArchiveModal && (
          <ModalPrompt
            heading={archiveModalHeading}
            text={archiveModalText}
            clbFunction={handleArchiveJobs}
            closeModal={handleArchiveModalVisibility}
          />
        )}

        <div className="dashboard-summary-invoicing">
          <div className="dashboard-summary-invoicing-container">
            <div className="dashboard-summary-invoicing-heading">Fakturace</div>

            <div className="dashboard-summary-invoicing-count">
              {totalEur + " € "}
            </div>
            <div className="dashboard-summary-invoicing-count">
              {totalCzk + " Kč"}
            </div>
          </div>
          <div className="dashboard-summary-invoicing-container">
            <div className="dashboard-summary-invoicing-heading">Výplata</div>
            <br />
            <div className="dashboard-summary-invoicing-count">
              {salary + " Kč"}
            </div>
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
        <button
          className="dashboard-archive-btn"
          onClick={() => setShowArchiveModal(true)}
        >
          Archivovat nejstarší měsíc
        </button>
      </section>
      <section className="dashboard-jobs">
        {currentJobs.map((oneJob) => {
          return <Job key={oneJob.id} jobDetails={oneJob} />;
        })}
      </section>
    </section>
  );
};

export default Dashboard;
