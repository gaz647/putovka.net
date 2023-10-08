/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InputField.css";

const InputField = ({
  label,
  subLabel,
  type,
  value,
  deleteCode,
  onDateChange,
  onWeightChange,
  onNumberChange,
  onEmailChange,
  onPasswordChange,
  onTextChange,
  onCheckboxChange,
  onTerminalChange,
}) => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //
  const [choosedWeight, setChoosedWeight] = useState(
    type === "weight" ? (value !== "" ? value : 27) : null
  );

  // USE EFFECT ----------------------------------------------------------
  //

  // HANDLE WEIGHT CHANGE ------------------------------------------------
  //
  const handleWeightChange = (value) => {
    setChoosedWeight(value);
    onWeightChange(Number(value));
  };

  // HANDLE DATE CHANGE --------------------------------------------------
  //
  const handleDateChange = (value) => {
    onDateChange(String(value));
  };

  // HANDLE TEXT CHANGE --------------------------------------------------
  //
  const handleTextChange = (value) => {
    onTextChange(String(value));
  };

  // HANDLE NUMBER CHANGE ------------------------------------------------
  //
  const handleNumberChange = (value) => {
    if (value < 0) {
      return;
    } else {
      onNumberChange(Number(value));
    }
  };

  // HANDLE EMAIL CHANGE -------------------------------------------------
  //
  const handleEmailChange = (value) => {
    onEmailChange(String(value));
  };

  // HANDLE PASSWORD CHANGE ----------------------------------------------
  //
  const handlePasswordChange = (value) => {
    onPasswordChange(String(value));
  };

  // HANDLE CHECKBOX CHANGE ----------------------------------------------
  //
  const handleCheckboxChange = (value) => {
    onCheckboxChange(value);
  };

  // HANDLE TERMINAL CHANGE ----------------------------------------------
  //
  const handleTerminalChange = (value) => {
    onTerminalChange(value);
  };

  return (
    <>
      {type === "date" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <>
                <br />
                <span className="input-field-sub-label">{" " + subLabel}</span>
              </>
            )}
          </div>
          <input
            className="input-field-field date"
            type="date"
            value={value}
            onChange={(e) => handleDateChange(e.target.value)}
          ></input>
        </div>
      )}

      {type === "text" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
            {deleteCode && (
              <span className="input-field-delete-code">{deleteCode}</span>
            )}
          </div>
          <input
            className="input-field-field"
            type="text"
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
          ></input>
        </div>
      )}

      {type === "number" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <input
            className="input-field-field"
            type="number"
            inputMode="numeric"
            value={value === 0 ? "" : value}
            onChange={(e) => handleNumberChange(e.target.value)}
            min="0"
          ></input>
        </div>
      )}

      {type === "number-decimal" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <>
                <br />
                <span className="input-field-sub-label">{" " + subLabel}</span>
              </>
            )}
          </div>
          <input
            className="input-field-field"
            type="number"
            step="0.0001"
            inputMode="numeric"
            value={value === 0 ? "" : value}
            onChange={(e) => handleNumberChange(e.target.value)}
            min="0"
          ></input>
        </div>
      )}

      {type === "email" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <input
            className="input-field-field"
            type="email"
            value={value}
            onChange={(e) => handleEmailChange(e.target.value)}
          ></input>
        </div>
      )}

      {type === "password" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <input
            className="input-field-field"
            type="password"
            value={value}
            onChange={(e) => handlePasswordChange(e.target.value)}
          ></input>
        </div>
      )}

      {type === "weight" && (
        <div className="input-field-container input-field-weight-container">
          <div
            className={`input-field-weight ${
              choosedWeight === 27 ? "input-field-weight-clicked" : ""
            }`}
            onClick={() => handleWeightChange(27)}
          >
            <div className="weight">
              <span
                className={`weight-text ${
                  choosedWeight === 27 ? "weight-text-clicked" : ""
                }`}
              >
                &lt;27t
              </span>
            </div>
          </div>
          <div
            className={`input-field-weight ${
              choosedWeight === 34 ? "input-field-weight-clicked" : ""
            }`}
            onClick={() => handleWeightChange(34)}
          >
            <div className="weight">
              <span
                className={`weight-text ${
                  choosedWeight === 34 ? "weight-text-clicked" : ""
                }`}
              >
                &lt;34t
              </span>
            </div>
          </div>
        </div>
      )}

      {type === "checkbox" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <>
                <br />
                <span className="input-field-sub-label">{" " + subLabel}</span>
              </>
            )}
          </div>
          <div className="input-field-checkbox-container">
            <input
              className="input-field-checkbox"
              type="checkbox"
              checked={value}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            ></input>
          </div>
        </div>
      )}

      {type === "terminal" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <>
                <br />
                <span className="input-field-sub-label">{" " + subLabel}</span>
              </>
            )}
          </div>

          <select
            className="input-field-field"
            value={value}
            onChange={(e) => handleTerminalChange(e.target.value)}
          >
            <option value="ceska_trebova">Česká Třebová</option>
            <option value="ostrava">Ostrava</option>
            <option value="plzen">Plzeň</option>
            <option value="praha">Praha</option>
            <option value="usti_nad_labem">Ústí nad Labem</option>
            <option value="zlin">Zlín</option>
          </select>
        </div>
      )}
    </>
  );
};

export default InputField;
