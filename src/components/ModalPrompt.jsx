/* eslint-disable react/prop-types */
import "./ModalPrompt.css";
import ConfirmDeclineBtns from "./ConfirmDeclineBtns";

const ModalPrompt = ({ heading, text, confirmFunction, declineFunction }) => {
  return (
    <section className="modal-background">
      <div className="modal-container">
        <div className="modal-heading text-shadow">{heading}</div>
        {text && (
          <div className="modal-text text-shadow">{"(" + text + ")"}</div>
        )}
        <ConfirmDeclineBtns
          confirmFunction={confirmFunction}
          declineFunction={declineFunction}
        />
      </div>
    </section>
  );
};

export default ModalPrompt;
