import "./AddJob.css";

const AddJob = () => {
  return (
    <section className="add-job wrapper">
      <form className="add-job-form">
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Datum
          </label>
          <input className="add-job-form-field" type="date" />
        </div>
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            CMR
          </label>
          <input className="add-job-form-field" type="text" />
        </div>
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Město
          </label>
          <input className="add-job-form-field" type="text" />
        </div>
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            PSČ
          </label>
          <input className="add-job-form-field" type="text" />
        </div>
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Váha
          </label>
          <input className="add-job-form-field" type="text" />
        </div>
        <div className="add-job-form-container-item">
          <label className="add-job-form-label" htmlFor="">
            Terminál
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
