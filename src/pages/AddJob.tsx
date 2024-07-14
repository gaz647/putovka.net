import { useState, useEffect } from "react";
import { MouseEventHandler } from "react";
import "./AddJob.css";
// import { useSelector, useDispatch } from "react-redux";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  addJobRedux,
  resetJobToAddValuesRedux,
  runToastRedux,
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const currentJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);
  const isAddJobReduxSuccess = useAppSelector(
    (state) => state.auth.isAddJobReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [isHoliday, setIsHoliday] = useState(false);
  const [date, setDate] = useState(getCurrentDate());
  const [day, setDay] = useState(getCzDayFromDate(date));
  const [city, setCity] = useState(
    useAppSelector((state) => state.auth.jobToAdd.city)
  );
  const [cmr, setCmr] = useState("");
  const [zipcode, setZipcode] = useState(
    useAppSelector((state) => state.auth.jobToAdd.zipcode)
  );
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);
  const [isSecondJob, setIsSecondJob] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [note, setNote] = useState("");
  const [basePlace, setBasePlace] = useState(
    useAppSelector(
      (state) => state.auth.loggedInUserData.userSettings.basePlace
    )
  );

  // ADD JOB -------------------------------------------------------------
  //
  const addJob: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const tempCurrentJobs = [...currentJobs];

    let newJob = {};

    if (!isHoliday) {
      if (!city || !cmr || !zipcode || !basePlace) {
        dispatch(
          runToastRedux({
            message: "Vyplňte povinná pole.",
            style: "error",
            time: 3000,
          })
        );
        return;
      }
      newJob = {
        basePlace: getProperTerminalName(basePlace),
        city,
        cmr,
        date,
        day,
        id: uuidv4(),
        isHoliday,
        isSecondJob,
        note,
        price: Number(price),
        timeSpent: Number(timeSpent),
        timestamp: new Date().getTime(),
        waiting: Number(waiting),
        weight: Number(weight),
        zipcode,
      };
    } else if (isHoliday) {
      newJob = {
        basePlace: "",
        city: "DOVOLENÁ",
        cmr: "",
        date,
        day,
        id: uuidv4(),
        isHoliday,
        isSecondJob: false,
        note,
        price: 0,
        timeSpent: 0,
        timestamp: new Date().getTime(),
        waiting: 0,
        weight: 0,
        zipcode: "",
      };
    }

    tempCurrentJobs.unshift(newJob);
    const sortedCurrentJobs = sortJobs(tempCurrentJobs);
    if (userUid) {
      const payload = { userUid, sortedCurrentJobs };
      dispatch(addJobRedux(payload));
      dispatch(resetJobToAddValuesRedux());
    }
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetJobToAddValuesRedux());
    navigate("/");
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
                  required={true}
                  label={"Město"}
                  subLabel={""}
                  type={"text"}
                  value={city}
                  onTextChange={(e) => setCity(e)}
                />

                <InputField
                  required={true}
                  label={"PSČ"}
                  subLabel={""}
                  type={"number"}
                  value={zipcode}
                  onNumberChange={(e) => setZipcode(e)}
                />

                <InputField
                  label={"Váha"}
                  subLabel={"kg"}
                  type={"number"}
                  value={weight}
                  onNumberChange={(e) => setWeight(e)}
                />

                <InputField
                  label={"Cena"}
                  subLabel={""}
                  type={"number"}
                  value={price}
                  onNumberChange={(e) => {
                    setPrice(e);
                    console.log(typeof e);
                  }}
                />

                <InputField
                  required={true}
                  label={"CMR"}
                  subLabel={""}
                  type={"text"}
                  value={cmr}
                  onTextChange={(e) => setCmr(e.toUpperCase())}
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
                  label={"Strávený čas"}
                  subLabel={""}
                  type={"number-decimal"}
                  value={timeSpent}
                  onNumberChange={(e) => setTimeSpent(e)}
                />

                <InputField
                  label={"Poznámka"}
                  subLabel={""}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />

                <InputField
                  required={true}
                  label={"Výchozí místo"}
                  subLabel={""}
                  type={"text"}
                  value={getProperTerminalName(basePlace)}
                  onTextChange={(e) => setBasePlace(e)}
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
              disabled={!isHoliday && (!city || !zipcode || !cmr)}
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
