/* eslint-disable react/prop-types */
import "./ConfirmDeclineBtns.css";
import { ImCheckmark, ImCross } from "react-icons/im";

const ConfirmDeclineBtns = ({ confirmFunction, declineFunction, disabled }) => {
  return (
    <div className="confirm-decline-btns-container">
      <button
        className={`confirm-decline-btns confirm-btn ${
          disabled && "confirm-btn-disabled"
        }`}
        onClick={confirmFunction}
        disabled={disabled}
      >
        <ImCheckmark className="confirm-decline-btn-icon" />
      </button>

      <button
        className="confirm-decline-btns decline-btn"
        onClick={declineFunction}
      >
        <ImCross className="confirm-decline-btn-icon" />
      </button>
    </div>
  );
};

export default ConfirmDeclineBtns;
