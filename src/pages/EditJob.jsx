import "./EditJob.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { editJobInDatabase, setEditing } from "../redux/JobsSlice";
import { useNavigate } from "react-router-dom";

const EditJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCustomJob = useSelector((state) => state.jobs.jobToEdit.isCustomJob);

  const [date, setDate] = useState(
    useSelector((state) => state.jobs.jobToEdit.date)
  );

  const getCurrentDayCZ = (dateVariable) => {
    const dateTransformed = new Date(dateVariable);
    const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    return daysOfTheWeek[dateTransformed.getDay()];
  };

  useEffect(() => {
    setDay(getCurrentDayCZ(date));
  }, [date]);

  const [day, setDay] = useState("");

  const [city, setCity] = useState(
    useSelector((state) => state.jobs.jobToEdit.city)
  );

  const [cmr, setCmr] = useState(
    useSelector((state) => state.jobs.jobToEdit.cmr)
  );

  const timestamp = useSelector((state) => state.jobs.jobToEdit.timestamp);

  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.jobs.jobToEdit.zipcode)
  );

  const weightTo27t = useSelector((state) => state.jobs.jobToEdit.weightTo27t);

  const weightTo34t = useSelector((state) => state.jobs.jobToEdit.weightTo34t);

  const [weight, setWeight] = useState(
    useSelector((state) => state.jobs.jobToEdit.weight)
  );

  const [clicked27, setClicked27] = useState(weight === 27 ? true : false);
  const [clicked34, setClicked34] = useState(weight === 34 ? true : false);

  const click27 = () => {
    setClicked27(true);
    setClicked34(false);
    setWeight(27);
    if (!isCustomJob) {
      setPrice(weightTo27t);
    }
  };

  const click34 = () => {
    setClicked34(true);
    setClicked27(false);
    setWeight(34);
    if (!isCustomJob) {
      setPrice(weightTo34t);
    }
  };

  const [price, setPrice] = useState(
    useSelector((state) => state.jobs.jobToEdit.price)
  );

  const [isSecondJob, setIsSecondJob] = useState(
    useSelector((state) => state.jobs.jobToEdit.isSecondJob)
  );

  const [waiting, setWaiting] = useState(
    useSelector((state) => state.jobs.jobToEdit.waiting)
  );

  const [note, setNote] = useState(
    useSelector((state) => state.jobs.jobToEdit.note)
  );

  const [terminal, setTerminal] = useState(
    useSelector((state) => state.jobs.jobToEdit.terminal)
  );

  const id = useSelector((state) => state.jobs.jobToEdit.id);

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

  const editJob = () => {
    const jobDetails = {
      city,
      cmr,
      date,
      day,
      id,
      isCustomJob,
      isSecondJob,
      note,
      price,
      terminal,
      timestamp,
      waiting,
      weight,
      weightTo27t,
      weightTo34t,
      zipcode,
    };
    const payload = { userUid, jobDetails };
    dispatch(editJobInDatabase(payload));
    dispatch(setEditing(false));
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
            value={terminal}
            onChange={(e) => setTerminal(e.target.value)}
          />
        </div>

        <button
          className="add-job-delete-all-fields-btn"
          type="button"
          onClick={editJob}
        >
          ULOŽIT ZMĚNY
        </button>
      </form>
    </section>
  );
};

export default EditJob;
