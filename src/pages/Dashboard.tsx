import "./Dashboard.css";
import ModalPrompt from "../components/ModalPrompt";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import {
  archiveDoneJobsFirstTimeRedux,
  archiveDoneJobsNewMonthRedux,
  archiveDoneJobsExistingMonthRedux,
  changeSettingsRedux,
  resetIsAddJobReduxSuccess,
  resetIsEditJobReduxSuccess,
  setIsLoading2FalseRedux,
  resetIsChangeSettingsReduxSuccess,
  runToastRedux,
} from "../redux/AuthSlice";
import { PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import { TbRoad } from "react-icons/tb";
import { FaUmbrellaBeach } from "react-icons/fa";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import getDateForComparing from "../customFunctionsAndHooks/getDateForComparing";
import sortArchiveMonthsDescending from "../customFunctionsAndHooks/sortArchiveMonthsDescending";
import sortArchiveMonthJobsAscending from "../customFunctionsAndHooks/sortArchiveMonthJobsAscending";
import sortCurrentJobsToBeArchivedAscending from "../customFunctionsAndHooks/sortCurrentJobsToBeArchivedAscending";
import trimArchiveOver13months from "../customFunctionsAndHooks/trimArchiveOver13month";
import getEurCzkCurrencyRate from "../customFunctionsAndHooks/getEurCzkCurrencyRate";
import Spinner from "../components/Spinner";
import BackToTopBtn from "../components/BackToTopBtn";
import { useNavigate } from "react-router-dom";
import { JobType } from "../types";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const loggedInUserSettings = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );
  const loggedInUserEmail = useAppSelector(
    (state) => state.auth.loggedInUserEmail
  );
  const currentJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );
  const archivedJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);

  const basePlace = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.basePlace
  );
  const email = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.email
  );
  const eurCzkRate = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.eurCzkRate
  );
  const nameFirst = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.nameFirst
  );
  const nameSecond = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.nameSecond
  );
  const numberEm = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.numberEm
  );
  const numberTrailer = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.numberTrailer
  );
  const numberTruck = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.numberTruck
  );
  const referenceId = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings.referenceId
  );
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);
  const isAddJobReduxSuccess = useAppSelector(
    (state) => state.auth.isAddJobReduxSuccess
  );
  const isEditJobReduxSuccess = useAppSelector(
    (state) => state.auth.isEditJobReduxSuccess
  );
  const isArchiveDoneJobsAllCasesReduxSuccess = useAppSelector(
    (state) => state.auth.isArchiveDoneJobsAllCasesReduxSuccess
  );
  const isChangeSettingsReduxSuccess = useAppSelector(
    (state) => state.auth.isChangeSettingsReduxSuccess
  );
  const infoMessages = useAppSelector((state) => state.auth.infoMessages);

  // USE STATE -----------------------------------------------------------
  //
  const [totalEur, setTotalEur] = useState(0);
  const [totalCzk, setTotalCzk] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalSecondJobs, setTotalSecondJobs] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const userSettings = {
    basePlace,
    email,
    eurCzkRate,
    nameFirst,
    nameSecond,
    numberEm,
    numberTrailer,
    numberTruck,
    referenceId,
  };

  // ARCHIVE JOBS 2 ------------------------------------------------------
  // nejdříve získá kurz EUR/CZK a až potom zavolá funkci archiveJobs ----
  //
  const archiveJobs2 = async () => {
    try {
      const renewedEurCzkRate = await getEurCzkCurrencyRate(); // Počká na dokončení asynchronní funkce
      archiveJobs(renewedEurCzkRate);
    } catch (error: any | null) {
      console.error(error.message);
    }
  };

  // ARCHIVE JOBS --------------------------------------------------------
  //
  const archiveJobs = (newEurCzkRate: number) => {
    setShowArchiveModal(!showArchiveModal);

    const currentArchivedJobs =
      archivedJobs.length > 0 ? [...archivedJobs] : [];

    const dateForArchiving =
      currentJobs[currentJobs.length - 1].date.slice(0, -2) + "01";

    const jobsToBeArchived = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) ===
        getDateForComparing(dateForArchiving)
    );

    const sortedJobsToBeArchived =
      sortCurrentJobsToBeArchivedAscending(jobsToBeArchived);

    const filteredCurrentJobs: JobType[] = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) !==
        getDateForComparing(dateForArchiving)
    );

    const monthToArchive = {
      date: dateForArchiving,
      jobs: sortedJobsToBeArchived,
      eurCzkRate,
    };

    // Pokud je archiv prázdný
    // ARCHIVE DONE JOBS FIRST TIME
    // (poslat nový kurz)
    //
    if (currentArchivedJobs.length === 0) {
      console.log("archiv je prázdný");
      console.log("první ukládání do archivu");

      if (userUid) {
        const payload = {
          userUid,
          monthToArchive: { ...monthToArchive },
          filteredCurrentJobs,
          userSettings,
          newEurCzkRate,
        };
        dispatch(archiveDoneJobsFirstTimeRedux(payload));
      }
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

        if (userUid) {
          const payload = {
            userUid,
            newMonthToArchive,
            filteredCurrentJobs,
            userSettings,
            newEurCzkRate,
          };

          dispatch(archiveDoneJobsNewMonthRedux(payload));
        }
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

        if (userUid) {
          const payload = {
            userUid,
            updatedArchivedJobs,
            filteredCurrentJobs,
            userSettings,
          };

          dispatch(archiveDoneJobsExistingMonthRedux(payload));
        }
      }
    }
  };

  // HANDLE MODAL VISIBILITY ---------------------------------------------
  //
  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  //
  //
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    setTotalJobs(
      currentJobs.filter((oneJob) => {
        return !oneJob.isHoliday;
      }).length
    );
    setTotalHolidays(
      currentJobs.filter((oneJob) => {
        return oneJob.isHoliday;
      }).length
    );
    setTotalSecondJobs(
      currentJobs.filter((oneJob) => oneJob.isSecondJob === true).length
    );
    setTotalTimeSpent(
      currentJobs.reduce((acc, oneJob) => {
        return acc + Number(oneJob.timeSpent);
      }, 0)
    );
    setTotalWaiting(
      currentJobs.reduce((acc, oneJob) => {
        return acc + Number(oneJob.waiting);
      }, 0)
    );
    setTotalEur(
      currentJobs.reduce((acc, oneJob) => {
        return acc + oneJob.price;
      }, 0)
    );
    setTotalCzk(Math.floor(totalEur * eurCzkRate));
  });

  useEffect(() => {
    if (email && loggedInUserEmail) {
      if (email !== loggedInUserEmail) {
        console.log(
          "email byl změněn --> spouštím dispatch pro změnu userSettings"
        );
        console.log(email);
        console.log(loggedInUserEmail);

        if (userUid) {
          const payload = {
            userUid,
            userSettings: {
              basePlace: loggedInUserSettings.basePlace,
              email: loggedInUserEmail,
              eurCzkRate: Number(loggedInUserSettings.eurCzkRate),
              nameFirst: loggedInUserSettings.nameFirst,
              nameSecond: loggedInUserSettings.nameSecond,
              numberEm: loggedInUserSettings.numberEm,
              numberTrailer: loggedInUserSettings.numberTrailer,
              numberTruck: loggedInUserSettings.numberTruck,
              referenceId: loggedInUserSettings.referenceId,
            },
          };
          console.log(payload);
          dispatch(changeSettingsRedux(payload));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, email, loggedInUserEmail]);

  useEffect(() => {
    if (isAddJobReduxSuccess) {
      dispatch(resetIsAddJobReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isEditJobReduxSuccess) {
      dispatch(resetIsEditJobReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isArchiveDoneJobsAllCasesReduxSuccess) {
      navigate("/archive");
    } else if (isChangeSettingsReduxSuccess) {
      dispatch(resetIsChangeSettingsReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    }
  }, [
    isAddJobReduxSuccess,
    isEditJobReduxSuccess,
    isArchiveDoneJobsAllCasesReduxSuccess,
    isChangeSettingsReduxSuccess,
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    //  NEW MESSAGE
    //
    const lsInfoMessages = localStorage.getItem("infoMessages");

    const lsInfoMessagesParsed = lsInfoMessages && JSON.parse(lsInfoMessages);

    if (infoMessages !== null) {
      console.log("infoMessages není null");

      const infoMessagesStringified = JSON.stringify(infoMessages);

      if (
        lsInfoMessages === null ||
        lsInfoMessagesParsed.length !== infoMessages.length
      ) {
        localStorage.setItem("infoMessages", infoMessagesStringified);

        dispatch(
          runToastRedux({
            message: "Nová zpráva - budete přesměrováni.",
            style: "warning",
            time: 2000,
          })
        );
        setTimeout(() => {
          navigate("/info-messages");
        }, 3000);
      }
    }
  }, [infoMessages, navigate]);

  return (
    <section className="wrapper relative">
      <BackToTopBtn />
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <section className="dashboard">
            {showArchiveModal && (
              <ModalPrompt
                heading={
                  "Archivovat práce z posledního měsíce ve Vašem výpisu?"
                }
                text={"tento krok nelze vrátit zpět"}
                confirmFunction={archiveJobs2}
                declineFunction={handleArchiveModalVisibility}
              />
            )}
            {/*  */}
            <div className="dashboard-summary-invoicing">
              <div className="dashboard-summary-invoicing-container-counts">
                <div className="dashboard-summary-invoicing-count dashboard-summary-invoicing-count-price">
                  {totalEur.toLocaleString() + " € "}
                </div>
                <div className="dashboard-summary-invoicing-count dashboard-summary-invoicing-count-price">
                  {totalCzk.toLocaleString() + " Kč"}
                </div>
              </div>

              {/*  */}

              <div className="dashboard-summary-invoicing-container-counts">
                <div className="dashboard-summary-invoicing-count">
                  <TbRoad className="dashboard-summary-counts-icon" />
                  {totalJobs}
                </div>
                <div className="dashboard-summary-invoicing-count">
                  <PiNumberSquareTwoBold className="dashboard-summary-counts-icon" />
                  {totalSecondJobs}
                </div>
                <div className="dashboard-summary-invoicing-count">
                  <PiClockBold className="dashboard-summary-counts-icon" />
                  {totalWaiting}
                </div>

                <div className="dashboard-summary-invoicing-count">
                  <LiaBusinessTimeSolid className="dashboard-summary-counts-icon" />
                  {totalTimeSpent}
                </div>

                <div className="dashboard-summary-invoicing-count">
                  <FaUmbrellaBeach className="dashboard-summary-counts-icon dashboard-summary-counts-icon-beach" />
                  {totalHolidays}
                </div>
              </div>
            </div>

            {currentJobs.length > 0 && (
              <button
                className="dashboard-archive-btn"
                onClick={() => {
                  setShowArchiveModal(true);
                }}
              >
                Archivovat nejstarší měsíc
              </button>
            )}
          </section>
          <section className="dashboard-jobs">
            {isLoading2 ? (
              <Spinner />
            ) : (
              <>
                {currentJobs.map((oneJob) => {
                  return <Job key={oneJob.id} jobDetails={oneJob} />;
                })}
              </>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default Dashboard;
