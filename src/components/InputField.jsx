/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InputField.css";
import { TfiEye } from "react-icons/tfi";
import { MdContentCopy } from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { PiMagnifyingGlassBold } from "react-icons/pi";

const InputField = ({
  required,
  label,
  subLabel,
  type,
  value,
  inputRef,
  deleteCode,
  onDateChange,
  onWeightChange,
  onNumberChange,
  onEmailChange,
  onPasswordChange,
  onTextChange,
  onCheckboxChange,
  onTerminalChange,
  onCopyReferenceId,
  onResetReferenceId,
  onSearchTextChange,
  onSearchInputDelete,
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
  const [showPassword, setShowPassword] = useState(false);

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
            {required && <div className="required">*</div>}
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
            required={required && true}
            onChange={(e) => handleTextChange(e.target.value)}
          ></input>
        </div>
      )}

      {type === "number" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {required && <div className="required">*</div>}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <input
            className="input-field-field"
            type="number"
            inputMode="numeric"
            value={value === 0 ? "" : value}
            required={required && true}
            onChange={(e) => handleNumberChange(e.target.value)}
            min="0"
          ></input>
        </div>
      )}

      {type === "number-decimal" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {required && <div className="required">*</div>}
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
            // inputMode="numeric"
            value={value === 0 ? "" : value}
            required={required && true}
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
            autoComplete="off"
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
          <div className="input-field-flex-container">
            <input
              className="input-field-field-password"
              type={!showPassword ? "password" : "text"}
              value={value}
              onChange={(e) => handlePasswordChange(e.target.value)}
              autoComplete="off"
            ></input>
            <div
              className={`show-password-btn ${
                showPassword ? "show-password-btn-clicked" : ""
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <TfiEye />
            </div>
          </div>
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

      {type === "referenceId" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <div className="input-field-flex-container">
            <div className="copy-reference-id-left" onClick={onCopyReferenceId}>
              <MdContentCopy />
            </div>
            <input
              className="input-field-field-reference-id"
              type="text"
              value={value}
              disabled
            ></input>
            <div
              className="reset-reference-id-right"
              onClick={onResetReferenceId}
            >
              <MdAutorenew />
            </div>
          </div>
        </div>
      )}

      {type === "searchBar" && (
        <div className="input-field-container">
          <div className="input-field-label text-shadow">
            {label !== "" || label !== undefined ? label : null}
            {subLabel && (
              <span className="input-field-sub-label">{" " + subLabel}</span>
            )}
          </div>
          <div className="input-field-flex-container">
            <div className="input-field-field-search-left">
              <PiMagnifyingGlassBold className="search-bar-magnifying-glass" />
            </div>
            <input
              className="input-field-field-search"
              type="text"
              placeholder="Obec / PSČ"
              autoFocus
              value={value}
              ref={inputRef}
              onChange={(e) => onSearchTextChange(e.target.value)}
            ></input>
            <div
              className="input-field-field-search-right"
              onClick={onSearchInputDelete}
            >
              <RxCross1 className={`vis-hidden ${value && "vis-visible"}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputField;
