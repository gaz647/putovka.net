import { useState } from "react";
import "./AddJob.css";
import { useSelector } from "react-redux";

const AddJob = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const currentDate = yyyy + "-" + mm + "-" + dd;
    return currentDate;
  };

  const [date, setDate] = useState(
    // useSelector((state) => state.jobs.jobToAdd.date)
    getCurrentDate()
  );

  const [cmr, setCmr] = useState("");

  const [city, setCity] = useState(
    useSelector((state) => state.jobs.jobToAdd.city)
  );

  const [zipcode, setZipcode] = useState(
    useSelector((state) => state.jobs.jobToAdd.zipcode)
  );

  const [weight, setWeight] = useState(
    useSelector((state) => state.jobs.jobToAdd.weight)
  );

  const [terminal, setTerminal] = useState(
    useSelector((state) => state.jobs.jobToAdd.terminal)
  );

  const [price, setPrice] = useState(
    useSelector((state) => state.jobs.jobToAdd.price)
  );

  const [isSecond, setIsSecondJob] = useState(
    useSelector((state) => state.jobs.jobToAdd.isSecondJob)
  );

  const [waiting, setWaiting] = useState(
    useSelector((state) => state.jobs.jobToAdd.waiting)
  );

  const [note, setNote] = useState(
    useSelector((state) => state.jobs.jobToAdd.note)
  );

  return (
    <section className="add-job wrapper">
      <form className="add-job-form">
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
            Váha
          </label>
          <input className="add-job-form-field" type="text" />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Cena
          </label>
          <input className="add-job-form-field" type="text" />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Druhá práce
          </label>
          <input className="add-job-form-field-checkbox" type="checkbox" />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Čekání
          </label>
          <input className="add-job-form-field" type="text" />
        </div>

        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Poznámka
          </label>
          <input className="add-job-form-field" type="text" />
        </div>

        <button className="add-job-delete-all-fields-btn" type="button">
          Vymazat vše
        </button>
      </form>
    </section>
  );
};

export default AddJob;
