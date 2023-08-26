import "./Dashboard.css";
import ModalPrompt from "../components/ModalPrompt";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { onSnapshot, doc } from "firebase/firestore";
import { PiTruck, PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import getDateForComparing from "../customFunctionsAndHooks/getDateForComparing";

const Dashboard = () => {
  const [currentJobs, setCurrentJobs] = useState([]);

  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

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
    const unsub = onSnapshot(doc(db, `users/${userUid}`), (doc) => {
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

  //
  //
  //
  const archiveJobs = () => {
    setShowArchiveModal(!showArchiveModal);

    const tempArchivedJobs = [...archivedJobs];

    const dateForArchiving =
      currentJobs[currentJobs.length - 1].date.slice(0, -2) + "01";

    const jobsToBeArchived = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) ===
        getDateForComparing(dateForArchiving)
    );

    const summaryJobs = jobsToBeArchived.length;

    const summarySecondJobs = jobsToBeArchived.reduce((acc, job) => {
      return job.isSecondJob ? acc + 1 : acc;
    }, 0);

    const summaryWaiting = jobsToBeArchived.reduce((acc, job) => {
      return acc + job.waiting;
    }, 0);

    const summaryEur = jobsToBeArchived.reduce((acc, job) => {
      return acc + job.price;
    }, 0);

    const summaryEurCzkRate = eurCzkRate;

    const summaryCzk = parseInt(summaryEur * summaryEurCzkRate);

    const summaryBaseMoney = baseMoney;

    const summaryPercentage = percentage;

    const summarySecondJobBenefit = secondJobBenefit;

    const summaryWaitingBenefit = waitingBenefit;

    const summarySalary = parseInt(
      summaryBaseMoney +
        summaryCzk * (summaryPercentage * 0.01) +
        summarySecondJobs * summarySecondJobBenefit +
        summaryWaiting * summaryWaitingBenefit
    );

    const monthToArchive = {
      date: dateForArchiving,
      jobs: jobsToBeArchived,
      summary: {
        jobs: summaryJobs,
        secondJobs: summarySecondJobs,
        waiting: summaryWaiting,
        eur: summaryEur,
        eurCzkRate: summaryEurCzkRate,
        czk: summaryCzk,
        baseMoney: summaryBaseMoney,
        percentage: summaryPercentage,
        salary: summarySalary,
      },
    };
    console.log("payload", monthToArchive);

    // Pokud je archiv prázdný
    //
    if (tempArchivedJobs.length === 0) {
      console.log("archiv je prázdný");
      console.log("první ukládání do archivu");
      const payload = { userUid, monthToArchive };
      console.log(payload);
      // dispatch(archiveDoneJobsFirstTime(payload))
    }
    // Pokud archív NENÍ prázdný
    //
    else {
      console.log("archiv není prázdný");

      const indexOfMonthToPutJobs = tempArchivedJobs.findIndex(
        (oneMonth) =>
          getDateForComparing(oneMonth.date) ===
          getDateForComparing(dateForArchiving)
      );

      // Když měsíc v archivu neexistuje
      //
      if (indexOfMonthToPutJobs === -1) {
        console.log("měsíc v archivu neexistuje");
        console.log("kód pro přidání nového měsíce do archivu");
      }
      // Když měsíc v archivu existuje
      //
      else {
        console.log("měsíc v archivu existuje");
        console.log("index měsíce v archivu je: ", indexOfMonthToPutJobs);
        console.log("kód pro přidání prací do existujícího měsíce v archivu");
      }
    }
  };
  //
  //
  //

  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  // const archiveMonthTemplate = {
  //   date: "2023-08-01",
  //   jobs: [{}, {}, {}],
  //   summary: {
  //     jobs: 0,
  //     eur: 0,
  //     czk: 0,
  //     secondJobs: 0,
  //     waiting: 0,
  //     eurCzkRate: 23.751,
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
            clbFunction={archiveJobs}
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
