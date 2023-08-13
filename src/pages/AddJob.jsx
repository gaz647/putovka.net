import { useState, useEffect } from "react";
import "./AddJob.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addJobToDatabase } from "../redux/JobsSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const currentDate = yyyy + "-" + mm + "-" + dd;
    return currentDate;
  };

  const [date, setDate] = useState(getCurrentDate());

  const getCurrentDayCZ = (dateVariable) => {
    const dateTransformed = new Date(dateVariable);
    const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    return daysOfTheWeek[dateTransformed.getDay()];
  };

  useEffect(() => {
    setDay(getCurrentDayCZ(date));
  }, [date]);

  const [day, setDay] = useState(getCurrentDayCZ(date));

  const [city, setCity] = useState(
    useSelector((state) => state.jobs.jobToAdd.city)
  );

  const [cmr, setCmr] = useState("");

  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.jobs.jobToAdd.zipcode)
  );

  const [weight, setWeight] = useState(
    useSelector((state) => state.jobs.jobToAdd.weight)
  );

  const [price, setPrice] = useState(
    useSelector((state) => state.jobs.jobToAdd.price)
  );

  const [isSecondJob, setIsSecondJob] = useState(false);

  const [waiting, setWaiting] = useState(0);

  const [note, setNote] = useState("");

  const [terminal, setTerminal] = useState(
    useSelector((state) => state.jobs.jobToAdd.terminal)
  );

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const addJob = () => {
    const jobDetails = {
      city,
      cmr,
      date,
      day,
      id: uuidv4(),
      isSecondJob,
      note,
      price,
      terminal,
      waiting,
      weight,
      zipcode,
    };
    const payload = { userUid, jobDetails };
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

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Váha (t)
          </label>
          <input
            className="add-job-form-field"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
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
            value={terminal}
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
