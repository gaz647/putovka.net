import { useState, useEffect } from "react";
import "./AddJob.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addJobRedux,
  resetJobToAddValuesRedux,
  // resetIsAddJobReduxSuccess,
} from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import getCzDayFromDate from "../customFunctionsAndHooks/getCzDayFromDate";
import getCurrentDate from "../customFunctionsAndHooks/getCurrentDate";
import getProperTerminalName from "../customFunctionsAndHooks/getProperTerminalName";
import sortJobs from "../customFunctionsAndHooks/sortJobs";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import InputField from "../components/InputField";
import Spinner from "../components/Spinner";

const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );
  const weightTo27t = useSelector((state) => state.auth.jobToAdd.weightTo27t);
  const weightTo34t = useSelector((state) => state.auth.jobToAdd.weightTo34t);
  const isCustomJob = useSelector((state) => state.auth.jobToAdd.isCustomJob);
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isAddJobReduxSuccess = useSelector(
    (state) => state.auth.isAddJobReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [isHoliday, setIsHoliday] = useState(false);
  const [date, setDate] = useState(getCurrentDate());
  const [day, setDay] = useState(getCzDayFromDate(date));
  const [city, setCity] = useState(
    useSelector((state) => state.auth.jobToAdd.city)
  );
  const [cmr, setCmr] = useState("");
  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.auth.jobToAdd.zipcode)
  );
  const [weight, setWeight] = useState(27);
  const [price, setPrice] = useState(weightTo27t);
  const [isSecondJob, setIsSecondJob] = useState(false);
  const [waiting, setWaiting] = useState(0);
  const [note, setNote] = useState("");
  const [terminal, setTerminal] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.terminal)
  );

  // ADD JOB -------------------------------------------------------------
  //
  const addJob = () => {
    const tempCurrentJobs = [...currentJobs];

    let newJob = {};

    if (!isHoliday) {
      newJob = {
        city,
        cmr,
        date,
        day,
        id: uuidv4(),
        isCustomJob,
        isHoliday,
        isSecondJob,
        note,
        price: Number(price),
        terminal: getProperTerminalName(terminal),
        timestamp: new Date().getTime(),
        waiting: Number(waiting),
        weight: Number(weight),
        weightTo27t: Number(weightTo27t),
        weightTo34t: Number(weightTo34t),
        zipcode,
      };
    } else if (isHoliday) {
      newJob = {
        city: "DOVOLENÁ",
        cmr: "",
        date,
        day,
        id: uuidv4(),
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

    tempCurrentJobs.unshift(newJob);
    const sortedCurrentJobs = sortJobs(tempCurrentJobs);
    const payload = { userUid, sortedCurrentJobs };
    dispatch(addJobRedux(payload));
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetJobToAddValuesRedux());
    navigate("/");
  };

  // HANDLE WEIGHT CHANGE
  //
  const handleWeightChange = (newWeight) => {
    if (newWeight === 27) {
      setWeight(27);
      setPrice(weightTo27t);
    } else if (newWeight === 34) {
      setWeight(34);
      setPrice(weightTo34t);
    }
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    setDay(getCzDayFromDate(date));
  }, [date]);

  useEffect(() => {
    if (isAddJobReduxSuccess) {
      // dispatch(resetIsAddJobReduxSuccess());
      navigate("/");
    }
  }, [dispatch, isAddJobReduxSuccess, navigate]);

  return (
    <section className="add-job wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <form className="add-job-form">
            {isCustomJob && (
              <div className="add-job-holiday-swich-container">
                <div
                  className={`add-job-holiday-switch add-job-switch ${
                    !isHoliday ? "add-job-holiday-selected" : ""
                  }`}
                  onClick={() => setIsHoliday(false)}
                >
                  PRÁCE
                </div>
                <div
                  className={`add-job-holiday-switch add-holiday-switch ${
                    isHoliday ? "add-job-holiday-selected" : ""
                  }`}
                  onClick={() => setIsHoliday(true)}
                >
                  DOVOLENÁ
                </div>
              </div>
            )}

            {!isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  subLabel={""}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />

                <InputField
                  label={"Město"}
                  subLabel={""}
                  type={"text"}
                  value={city}
                  onTextChange={(e) => setCity(e)}
                />

                <InputField
                  label={"PSČ"}
                  subLabel={""}
                  type={"text"}
                  value={zipcode}
                  onTextChange={(e) => setZipcode(e)}
                />

                <InputField
                  label={""}
                  subLabel={""}
                  type={"weight"}
                  value={""}
                  onWeightChange={(e) => handleWeightChange(e)}
                />

                <InputField
                  label={"Cena"}
                  subLabel={""}
                  type={"number"}
                  value={price}
                  onNumberChange={(e) => setPrice(e)}
                />

                <InputField
                  label={"CMR"}
                  subLabel={""}
                  type={"text"}
                  value={cmr}
                  onTextChange={(e) => setCmr(e)}
                />

                <InputField
                  label={"Druhá práce"}
                  subLabel={""}
                  type={"checkbox"}
                  value={isSecondJob}
                  onCheckboxChange={(e) => setIsSecondJob(e)}
                />

                <InputField
                  label={"Čekání"}
                  subLabel={""}
                  type={"number"}
                  value={waiting}
                  onNumberChange={(e) => setWaiting(e)}
                />

                <InputField
                  label={"Poznámka"}
                  subLabel={""}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />

                <InputField
                  label={"Terminál"}
                  subLabel={""}
                  type={"text"}
                  value={getProperTerminalName(terminal)}
                  onTextChange={(e) => setTerminal(e)}
                />
              </>
            )}
            {isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  subLabel={""}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />
                <InputField
                  label={"Poznámka"}
                  subLabel={""}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />
              </>
            )}
            <ConfirmDeclineBtns
              confirmFunction={addJob}
              declineFunction={handleDecline}
            />
          </form>
        </>
      )}
    </section>
  );
};

export default AddJob;
