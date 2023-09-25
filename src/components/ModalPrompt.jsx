/* eslint-disable react/prop-types */
import "./ModalPrompt.css";
// import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import ConfirmDeclineBtns from "./ConfirmDeclineBtns";

const ModalPrompt = ({ heading, text, confirmFunction, declineFunction }) => {
  return (
    <section className="modal-background">
      <div className="modal-container">
        <div className="modal-heading">{heading}</div>
        {text !== "" ? <>{"(" + text + ")"}</> : null}
        <ConfirmDeclineBtns
          confirmFunction={confirmFunction}
          declineFunction={declineFunction}
        />
      </div>
    </section>
  );
};

export default ModalPrompt;
