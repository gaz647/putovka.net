/* eslint-disable react/prop-types */
import "./ConfirmDeclineBtns.css";
import { ImCheckmark, ImCross } from "react-icons/im";

const ConfirmDeclineBtns = ({ confirmFunction, declineFunction }) => {
  return (
    <div className="confirm-decline-btns-container">
      <div
        className="confirm-decline-btns confirm-btn"
        onClick={confirmFunction}
      >
        <ImCheckmark className="confirm-btn-icon" />
      </div>

      <div
        className="confirm-decline-btns decline-btn"
        onClick={declineFunction}
      >
        <ImCross className="decline-btn-icon" />
      </div>
    </div>
  );
};

export default ConfirmDeclineBtns;
