import "./EditJob.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  editJobRedux,
  editArchiveJobRedux,
  setIsEditingFalseRedux,
  setIsEditingArchivedJobFalseRedux,
  resetJobToEditValuesRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import sortJobs from "../customFunctionsAndHooks/sortJobs";
import sortArchiveMonthJobsAscending from "../customFunctionsAndHooks/sortArchiveMonthJobsAscending";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import InputField from "../components/InputField";
import Spinner from "../components/Spinner";

const EditJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );
  const isCustomJob = useSelector((state) => state.auth.jobToEdit.isCustomJob);
  const isHoliday = useSelector((state) => state.auth.jobToEdit.isHoliday);
  const timestamp = useSelector((state) => state.auth.jobToEdit.timestamp);
  const weightTo27t = useSelector((state) => state.auth.jobToEdit.weightTo27t);
  const weightTo34t = useSelector((state) => state.auth.jobToEdit.weightTo34t);
  const [price, setPrice] = useState(
    useSelector((state) => state.auth.jobToEdit.price)
  );
  const [isSecondJob, setIsSecondJob] = useState(
    useSelector((state) => state.auth.jobToEdit.isSecondJob)
  );
  const [waiting, setWaiting] = useState(
    useSelector((state) => state.auth.jobToEdit.waiting)
  );
  const [note, setNote] = useState(
    useSelector((state) => state.auth.jobToEdit.note)
  );
  const [terminal, setTerminal] = useState(
    useSelector((state) => state.auth.jobToEdit.terminal)
  );
  const id = useSelector((state) => state.auth.jobToEdit.id);
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const isEditingArchivedJob = useSelector(
    (state) => state.auth.isEditingArchivedJob
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isEditJobReduxSuccess = useSelector(
    (state) => state.auth.isEditJobReduxSuccess
  );
  const isEditArchiveJobReduxSuccess = useSelector(
    (state) => state.auth.isEditArchiveJobReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [date, setDate] = useState(
    useSelector((state) => state.auth.jobToEdit.date)
  );
  const [day, setDay] = useState("");
  const [city, setCity] = useState(
    useSelector((state) => state.auth.jobToEdit.city)
  );
  const [cmr, setCmr] = useState(
    useSelector((state) => state.auth.jobToEdit.cmr)
  );
  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.auth.jobToEdit.zipcode)
  );
  const [weight, setWeight] = useState(
    useSelector((state) => state.auth.jobToEdit.weight)
  );

  // GET CURRENT DAY CZ --------------------------------------------------
  //
  const getCurrentDayCZ = (dateVariable) => {
    const dateTransformed = new Date(dateVariable);
    const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    return daysOfTheWeek[dateTransformed.getDay()];
  };

  // HANDLE WEIGHT CHANGE ------------------------------------------------
  //
  const handleWeightChange = (newWeight) => {
    if (newWeight === 27) {
      setWeight(27);
      if (!isCustomJob) {
        setPrice(weightTo27t);
        // console.log("weight:", weight, "price:", price);
      }
    } else if (newWeight === 34) {
      setWeight(34);
      if (!isCustomJob) {
        setPrice(weightTo34t);
        // console.log("weight:", weight, "price:", price);
      }
    }
  };

  // EDIT JOB ------------------------------------------------------------
  //
  const editJob = () => {
    let editedJob = {};

    if (!isHoliday) {
      if (!city || !cmr || !zipcode || !terminal) {
        dispatch(
          runToastRedux({
            message: "Vyplňte povinná pole.",
            style: "error",
            time: 3000,
          })
        );
        return;
      }

      editedJob = {
        city,
        cmr,
        date,
        day,
        id,
        isCustomJob,
        isHoliday,
        isSecondJob,
        note,
        price: Number(price),
        terminal,
        timestamp: Number(timestamp),
        waiting: Number(waiting),
        weight: Number(weight),
        weightTo27t: Number(weightTo27t),
        weightTo34t: Number(weightTo34t),
        zipcode,
      };
    } else if (isHoliday) {
      editedJob = {
        city: "DOVOLENÁ",
        cmr: "",
        date,
        day,
        id,
        isCustomJob,
        isHoliday,
        isSecondJob: false,
        note,
        price: 0,
        terminal: "",
        timestamp: new Date().getTime(),
        waiting: 0,
        weight: 0,
        weightTo27t: 0,
        weightTo34t: 0,
        zipcode: "",
      };
    }
    // EDIT CURRENT JOB
    if (!isEditingArchivedJob) {
      console.log("editována práce z currentJobs");

      const tempCurrentJobs = [...currentJobs];

      const indexOfJobToBeEdited = tempCurrentJobs.findIndex(
        (job) => job.id === editedJob.id
      );

      if (indexOfJobToBeEdited !== -1) {
        tempCurrentJobs[indexOfJobToBeEdited] = editedJob;

        const sortedCurrentJobsEdit = sortJobs(tempCurrentJobs);

        const payload = { userUid, sortedCurrentJobsEdit };

        dispatch(editJobRedux(payload));
      }
    }
    // EDIT ARCHIVED JOB
    else if (isEditingArchivedJob) {
      console.log("bude upravena práce z archivu");

      const tempArchivedJobs = [...archivedJobs];

      const updatedArchivedJobs = tempArchivedJobs.map((oneMonth) => {
        if (oneMonth.jobs.some((job) => job.id === id)) {
          const updatedJobs = oneMonth.jobs.map((job) =>
            job.id === id ? editedJob : job
          );
          return {
            ...oneMonth,
            jobs: updatedJobs,
          };
        }
        return oneMonth;
      });

      const sortedUpdatedArchivedJobs =
        sortArchiveMonthJobsAscending(updatedArchivedJobs);

      const payload = {
        userUid,
        sortedUpdatedArchivedJobs,
      };

      dispatch(editArchiveJobRedux(payload));
    }
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetJobToEditValuesRedux());
    dispatch(setIsEditingFalseRedux());
    if (isEditingArchivedJob) {
      navigate("/archive");
    } else if (!isEditingArchivedJob) {
      navigate("/");
    }
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    setDay(getCurrentDayCZ(date));
  }, [date]);

  useEffect(() => {
    if (isEditJobReduxSuccess) {
      dispatch(resetJobToEditValuesRedux());
      dispatch(setIsEditingFalseRedux());
      navigate("/");
    } else if (isEditArchiveJobReduxSuccess) {
      dispatch(resetJobToEditValuesRedux());
      dispatch(setIsEditingFalseRedux());
      dispatch(setIsEditingArchivedJobFalseRedux());
      navigate("/archive");
    }
  }, [dispatch, isEditArchiveJobReduxSuccess, isEditJobReduxSuccess, navigate]);

  return (
    <section className="add-job wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <form className="add-job-form">
            {!isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />

                <InputField
                  required={true}
                  label={"Město"}
                  type={"text"}
                  value={city}
                  onTextChange={(e) => setCity(e)}
                />

                <InputField
                  required={true}
                  label={"PSČ"}
                  type={"text"}
                  value={zipcode}
                  onTextChange={(e) => setZipcode(e)}
                />

                <InputField
                  label={""}
                  type={"weight"}
                  value={weight}
                  onWeightChange={(e) => handleWeightChange(e)}
                />

                <InputField
                  label={"Cena"}
                  type={"number"}
                  value={price}
                  onNumberChange={(e) => setPrice(e)}
                />

                <InputField
                  required={true}
                  label={"CMR"}
                  type={"text"}
                  value={cmr}
                  onTextChange={(e) => setCmr(e)}
                />

                <InputField
                  label={"Druhá práce"}
                  type={"checkbox"}
                  value={isSecondJob}
                  onCheckboxChange={(e) => setIsSecondJob(e)}
                />

                <InputField
                  label={"Čekání"}
                  type={"number"}
                  value={waiting}
                  onNumberChange={(e) => setWaiting(e)}
                />

                <InputField
                  label={"Poznámka"}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />

                <InputField
                  required={true}
                  label={"Terminál"}
                  type={"text"}
                  value={terminal}
                  onTextChange={(e) => setTerminal(e)}
                />
              </>
            )}
            {isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />
                <InputField
                  label={"Poznámka"}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />
              </>
            )}

            <ConfirmDeclineBtns
              disabled={!city || !zipcode || !cmr || !terminal}
              confirmFunction={editJob}
              declineFunction={handleDecline}
            />
          </form>
        </>
      )}
    </section>
  );
};

export default EditJob;
