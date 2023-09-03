import "./Dashboard.css";
import ModalPrompt from "../components/ModalPrompt";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  archiveDoneJobsFirstTime,
  archiveDoneJobsNewMonth,
  archiveDoneJobsExistingMonth,
  changeSettings,
} from "../redux/AuthSlice";
// import { db } from "../firebase/config";
// import { onSnapshot, doc } from "firebase/firestore";
import { PiTruck, PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import getDateForComparing from "../customFunctionsAndHooks/getDateForComparing";
import sortArchiveMonthsDescending from "../customFunctionsAndHooks/sortArchiveMonthsDescending";
import sortArchiveMonthJobsAscending from "../customFunctionsAndHooks/sortArchiveMonthJobsAscending";
import trimArchiveOver13months from "../customFunctionsAndHooks/trimArchiveOver13month";
import getEurCzkCurrencyRate from "../customFunctionsAndHooks/getEurCzkCurrencyRate";

const Dashboard = () => {
  const dispatch = useDispatch();

  // const [currentJobs, setCurrentJobs] = useState([]);

  const loggedInUserSettings = useSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );

  const loggedInUserEmail = useSelector(
    (state) => state.auth.loggedInUserEmail
  );

  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

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

  const userSettings = useSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );

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

  // useEffect(() => {
  //   const unsub = onSnapshot(doc(db, `users/${userUid}`), (doc) => {
  //     setCurrentJobs(doc.data().currentJobs);
  //   });
  //   return () => {
  //     unsub();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  const email = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.email
  );

  useEffect(() => {
    if (email && loggedInUserEmail) {
      if (email !== loggedInUserEmail) {
        console.log(
          "email byl změněn --> spouštím dispatch pro změnu userSettings"
        );
        console.log(email);
        console.log(loggedInUserEmail);

        const payload = {
          userUid,
          userSettings: {
            baseMoney: Number(loggedInUserSettings.baseMoney),
            email: loggedInUserEmail,
            eurCzkRate: Number(loggedInUserSettings.eurCzkRate),
            percentage: Number(loggedInUserSettings.percentage),
            secondJobBenefit: Number(loggedInUserSettings.secondJobBenefit),
            terminal: loggedInUserSettings.terminal,
            waitingBenefit: Number(loggedInUserSettings.waitingBenefit),
          },
        };
        console.log(payload);
        dispatch(changeSettings(payload));
      }
    }
  }, [dispatch, email, loggedInUserEmail, loggedInUserSettings, userUid]);

  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const archiveModalHeading =
    "Archivovat práce z posledního měsíce ve Vašem výpisu? ";

  const archiveModalText = "tento krok nelze vrátit";

  // Funkce archiveJobs2 která nejdříve získá kurz EUR/CZK a až potom zavolá funkci archiveJobs
  //
  //
  const archiveJobs2 = async () => {
    // ... (existující části kódu)

    try {
      const renewedEurCzkRate = await getEurCzkCurrencyRate(); // Počká na dokončení asynchronní funkce
      // ... (zbytek kódu, který závisí na hodnotě eurCzkRate)
      //
      //
      archiveJobs(renewedEurCzkRate);
      //
      //
      //
    } catch (error) {
      console.error(error.message);
    }
  };
  //
  //
  //
  const archiveJobs = (newEurCzkRate) => {
    setShowArchiveModal(!showArchiveModal);

    const currentArchivedJobs =
      archivedJobs.length > 0 ? [...archivedJobs] : [];
    console.log("currentArchivedJobs", currentArchivedJobs);

    const dateForArchiving =
      currentJobs[currentJobs.length - 1].date.slice(0, -2) + "01";

    const jobsToBeArchived = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) ===
        getDateForComparing(dateForArchiving)
    );

    const filteredCurrentJobs = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) !==
        getDateForComparing(dateForArchiving)
    );

    const monthToArchive = {
      date: dateForArchiving,
      jobs: jobsToBeArchived,
      userSettings: {
        baseMoney,
        eurCzkRate,
        percentage,
        secondJobBenefit,
        waitingBenefit,
      },
    };

    // Pokud je archiv prázdný
    // ARCHIVE DONE JOBS FIRST TIME
    // (poslat nový kurz)
    //
    if (currentArchivedJobs.length === 0) {
      console.log("archiv je prázdný");
      console.log("první ukládání do archivu");
      const payload = {
        userUid,
        monthToArchive: [{ ...monthToArchive }],
        filteredCurrentJobs,
        userSettings,
        newEurCzkRate,
      };
      console.log(payload);
      dispatch(archiveDoneJobsFirstTime(payload));
    }
    // Pokud archív NENÍ prázdný
    //
    else {
      console.log("archiv není prázdný");

      const indexOfMonthToPutJobs = currentArchivedJobs.findIndex(
        (oneMonth) =>
          getDateForComparing(oneMonth.date) ===
          getDateForComparing(dateForArchiving)
      );
      //
      //
      // Když měsíc v archivu neexistuje
      // ARCHIVE DONE JOBS NEW MONTH
      // (poslat nový kurz)
      //
      //
      //
      if (indexOfMonthToPutJobs === -1) {
        console.log("měsíc v archivu neexistuje");
        console.log("kód pro přidání nového měsíce do archivu");

        const newMonthToArchive = trimArchiveOver13months(
          sortArchiveMonthJobsAscending(
            sortArchiveMonthsDescending([...archivedJobs, monthToArchive])
          )
        );

        console.log("newMonthToArchive", newMonthToArchive);

        const payload = {
          userUid,
          newMonthToArchive,
          filteredCurrentJobs,
          userSettings,
          newEurCzkRate,
        };
        console.log(payload);
        dispatch(archiveDoneJobsNewMonth(payload));
      }
      //
      //
      // Když měsíc v archivu existuje
      // ARCHIVE DONE JOBS FIRST TIME
      //
      //
      else {
        console.log("měsíc v archivu existuje");
        console.log("index měsíce v archivu je: ", indexOfMonthToPutJobs);
        console.log("kód pro přidání prací do existujícího měsíce v archivu");

        const updatedArchivedJobs = sortArchiveMonthJobsAscending(
          currentArchivedJobs.map((archivedMonth, index) => {
            if (index === indexOfMonthToPutJobs) {
              return {
                ...archivedMonth,
                jobs: [...archivedMonth.jobs, ...jobsToBeArchived],
              };
            }
            return archivedMonth;
          })
        );
        console.log(filteredCurrentJobs);

        console.log(updatedArchivedJobs);

        const payload = {
          userUid,
          updatedArchivedJobs,
          filteredCurrentJobs,
          userSettings,
        };

        dispatch(archiveDoneJobsExistingMonth(payload));
      }
    }
  };
  //
  //
  //

  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  return (
    <section className="wrapper relative">
      <section className="dashboard">
        {showArchiveModal && (
          <ModalPrompt
            heading={archiveModalHeading}
            text={archiveModalText}
            clbFunction={archiveJobs2}
            closeModal={handleArchiveModalVisibility}
          />
        )}
        <div>{eurCzkRate}</div>
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
