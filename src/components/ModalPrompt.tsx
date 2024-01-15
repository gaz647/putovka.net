import "./ModalPrompt.css";
import { MouseEventHandler } from "react";
import ConfirmDeclineBtns from "./ConfirmDeclineBtns";

const ModalPrompt = ({
  heading,
  text,
  confirmFunction,
  declineFunction,
}: {
  heading: string;
  text?: string;
  confirmFunction: MouseEventHandler<HTMLButtonElement>;
  declineFunction: MouseEventHandler<HTMLButtonElement>;
}) => {
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
