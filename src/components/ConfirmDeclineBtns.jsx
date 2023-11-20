/* eslint-disable react/prop-types */
import "./ConfirmDeclineBtns.css";
import { ImCheckmark, ImCross } from "react-icons/im";
import { MdDoNotDisturbAlt } from "react-icons/md";

const ConfirmDeclineBtns = ({
  confirmFunction,
  declineFunction,
  disabled,
  register,
}) => {
  return (
    <div className="confirm-decline-btns-container">
      <button
        className={`confirm-decline-btns confirm-btn ${
          disabled && "confirm-btn-disabled"
        } ${register && "confirm-btn-register"}`}
        onClick={confirmFunction}
        disabled={disabled}
      >
        {register ? (
          "REGISTROVAT"
        ) : disabled ? (
          <MdDoNotDisturbAlt className="confirm-decline-btn-icon" />
        ) : (
          <ImCheckmark className="confirm-decline-btn-icon" />
        )}
      </button>
      {!register && (
        <button
          className="confirm-decline-btns decline-btn"
          onClick={declineFunction}
        >
          <ImCross className="confirm-decline-btn-icon" />
        </button>
      )}
    </div>
  );
};

export default ConfirmDeclineBtns;
