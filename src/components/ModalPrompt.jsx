/* eslint-disable react/prop-types */
import "./ModalPrompt.css";

const ModalPrompt = ({ heading, text, clbFunction, closeModal }) => {
  return (
    <section className="modal-background">
      <div className="modal-container">
        <div className="modal-heading">{heading}</div>
        {text !== "" ? (
          <div className="modal-text">{"(" + text + ")"}</div>
        ) : null}

        <div className="modal-buttons-container">
          <button
            className="modal-buttons submit-green"
            onClick={clbFunction}
          ></button>
          <button
            className="modal-buttons decline-red"
            onClick={closeModal}
          ></button>
        </div>
      </div>
    </section>
  );
};

export default ModalPrompt;
