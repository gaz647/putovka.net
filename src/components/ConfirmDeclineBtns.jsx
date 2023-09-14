/* eslint-disable react/prop-types */
import "./ConfirmDeclineBtns.css";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

const ConfirmDeclineBtns = ({ confirmFunction, declineFunction }) => {
  return (
    <div className="confirm-decline-btns-container">
      <AiFillCheckCircle
        className="circle-btns confirm-circle-btn"
        onClick={confirmFunction}
      />

      <AiFillCloseCircle
        className="circle-btns decline-circle-btn"
        onClick={declineFunction}
      />
    </div>
  );
};

export default ConfirmDeclineBtns;
