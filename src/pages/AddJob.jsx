import { useState, useEffect } from "react";
import "./AddJob.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addJobToDatabase } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import getCzDayFromDate from "../customFunctionsAndHooks/getCzDayFromDate";
import getCurrentDate from "../customFunctionsAndHooks/getCurrentDate";
import getProperTerminalName from "../customFunctionsAndHooks/getProperTerminalName";
import sortJobs from "../customFunctionsAndHooks/sortJobs";

const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );

  // const getCurrentDate = () => {
  //   const today = new Date();
  //   const dd = String(today.getDate()).padStart(2, "0");
  //   const mm = String(today.getMonth() + 1).padStart(2, "0");
  //   const yyyy = today.getFullYear();
  //   const currentDate = yyyy + "-" + mm + "-" + dd;
  //   return currentDate;
  // };

  const [date, setDate] = useState(getCurrentDate());

  // const getCurrentDayCz = (dateVariable) => {
  //   const dateTransformed = new Date(dateVariable);
  //   const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
  //   return daysOfTheWeek[dateTransformed.getDay()];
  // };

  useEffect(() => {
    setDay(getCzDayFromDate(date));
  }, [date]);

  const [day, setDay] = useState(getCzDayFromDate(date));

  const [city, setCity] = useState(
    useSelector((state) => state.auth.jobToAdd.city)
  );

  const [cmr, setCmr] = useState("");

  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.auth.jobToAdd.zipcode)
  );

  const weightTo27t = useSelector((state) => state.auth.jobToAdd.weightTo27t);

  const weightTo34t = useSelector((state) => state.auth.jobToAdd.weightTo34t);

  const [weight, setWeight] = useState(27);

  const [clicked27, setClicked27] = useState(true);
  const [clicked34, setClicked34] = useState(false);

  const click27 = () => {
    setClicked27(true);
    setClicked34(false);
    setWeight(27);
    setPrice(weightTo27t);
  };

  const click34 = () => {
    setClicked34(true);
    setClicked27(false);
    setWeight(34);
    setPrice(weightTo34t);
  };

  const [price, setPrice] = useState(weightTo27t);

  const isCustomJob = useSelector((state) => state.auth.jobToAdd.isCustomJob);

  const [isSecondJob, setIsSecondJob] = useState(false);

  const [waiting, setWaiting] = useState(0);

  const [note, setNote] = useState("");

  const [terminal, setTerminal] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.terminal)
  );

  // const displayProperTerminalName = (value) => {
  //   if (value === "ceska_trebova") {
  //     return "Česká Třebová";
  //   } else if (value === "ostrava") {
  //     return "Ostrava";
  //   } else if (value === "plzen") {
  //     return "Plzeň";
  //   } else if (value === "praha") {
  //     return "Praha";
  //   } else if (value === "usti_nad_labem") {
  //     return "Ústí nad Labem";
  //   } else if (value === "zlin") {
  //     return "Zlín";
  //   } else {
  //     return value;
  //   }
  // };

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const addJob = () => {
    const tempCurrentJobs = [...currentJobs];

    const newJob = {
      city,
      cmr,
      date,
      day,
      id: uuidv4(),
      isCustomJob,
      isSecondJob,
      note,
      price,
      terminal: getProperTerminalName(terminal),
      timestamp: new Date().getTime(),
      waiting: Number(waiting),
      weight,
      weightTo27t,
      weightTo34t,
      zipcode,
    };

    tempCurrentJobs.unshift(newJob);

    const sortedCurrentJobs = sortJobs(tempCurrentJobs);

    const payload = { userUid, sortedCurrentJobs };

    dispatch(addJobToDatabase(payload));
    navigate("/");
  };

  return (
    <section className="add-job wrapper">
      <form className="add-job-form">
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Datum
          </label>
          <input
            className="add-job-form-field"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Město
          </label>
          <input
            className="add-job-form-field"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            PSČ
          </label>
          <input
            className="add-job-form-field"
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item-weight">
          <div
            className={`add-job-form-field-weight ${
              clicked27 ? "clicked" : ""
            }`}
            onClick={click27}
          >
            <div className="weight">&lt;27t</div>
          </div>
          <div
            className={`add-job-form-field-weight ${
              clicked34 ? "clicked" : ""
            }`}
            onClick={click34}
          >
            <div className="weight">&lt;34t</div>
          </div>
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Cena
          </label>
          <input
            className="add-job-form-field"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            CMR
          </label>
          <input
            className="add-job-form-field"
            type="text"
            value={cmr}
            onChange={(e) => setCmr(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Druhá práce
          </label>
          <input
            className="add-job-form-field-checkbox"
            type="checkbox"
            checked={isSecondJob}
            onChange={(e) => setIsSecondJob(e.target.checked)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Čekání
          </label>
          <input
            className="add-job-form-field"
            type="number"
            value={waiting}
            onChange={(e) => setWaiting(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Poznámka
          </label>
          <input
            className="add-job-form-field"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Terminál
          </label>
          <input
            className="add-job-form-field"
            type="text"
            value={getProperTerminalName(terminal)}
            onChange={(e) => setTerminal(e.target.value)}
          />
        </div>

        <button
          className="add-job-delete-all-fields-btn"
          type="button"
          onClick={addJob}
        >
          PŘIDAT
        </button>
      </form>
    </section>
  );
};

export default AddJob;
