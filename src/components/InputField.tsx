/* eslint-disable react/prop-types */
import React, { useState, ChangeEvent } from "react";
import "./InputField.css";
import { TfiEye } from "react-icons/tfi";
import { MdContentCopy } from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import isValidEmailFormat from "../customFunctionsAndHooks/isValidEmailFormat";

interface InputFieldProps {
  required?: boolean;
  label: string;
  subLabel?: string;
  type: string;
  value?: string | number | boolean | Date;
  inputRef?: React.RefObject<HTMLInputElement>;
  deleteCode?: string;
  onDateChange?: (value: string) => void;
  onWeightChange?: (value: number) => void;
  onNumberChange?: (value: number) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onTextChange?: (value: string) => void;
  onCheckboxChange?: (value: boolean) => void;
  onTerminalChange?: (value: string) => void;
  onCopyReferenceId?: () => void;
  onResetReferenceId?: () => void;
  onSearchTextChange?: (value: string) => void;
  onSearchInputDelete?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
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
  const handleWeightChange = (value: number) => {
    setChoosedWeight(value);
    onWeightChange && onWeightChange(value);
  };

  // HANDLE DATE CHANGE --------------------------------------------------
  //
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    onDateChange && onDateChange(e.target.value);
  };

  // HANDLE TEXT CHANGE --------------------------------------------------
  //
  const handleTextChange = (value: string) => {
    onTextChange && onTextChange(value);
  };

  // HANDLE NUMBER CHANGE ------------------------------------------------
  //
  const handleNumberChange = (value: number) => {
    if (value < 0) {
      return;
    } else {
      onNumberChange && onNumberChange(value);
    }
  };

  // HANDLE EMAIL CHANGE -------------------------------------------------
  //
  const handleEmailChange = (value: string) => {
    onEmailChange && onEmailChange(value);
  };

  // HANDLE PASSWORD CHANGE ----------------------------------------------
  //
  const handlePasswordChange = (value: string) => {
    onPasswordChange && onPasswordChange(value);
  };

  // HANDLE CHECKBOX CHANGE ----------------------------------------------
  //
  const handleCheckboxChange = (value: boolean) => {
    onCheckboxChange && onCheckboxChange(value);
  };

  // HANDLE TERMINAL CHANGE ----------------------------------------------
  //
  const handleTerminalChange = (value: string) => {
    onTerminalChange && onTerminalChange(value);
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
            value={value as string}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDateChange(e)
            }
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
            value={value as string}
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
            value={value === 0 ? "" : String(value)}
            required={required && true}
            onChange={(e) => handleNumberChange(Number(e.target.value))}
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
            value={value === 0 ? "" : String(value)}
            required={required && true}
            onChange={(e) => handleNumberChange(Number(e.target.value))}
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
            className={`input-field-field-email ${
              value &&
              typeof value === "string" &&
              !isValidEmailFormat(value) &&
              "input-field-field-email-invalid"
            }`}
            type="email"
            value={value as string}
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
              value={value as string}
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
              checked={value as boolean}
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
            value={value as string}
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
              value={value as string}
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
              value={value as string}
              ref={inputRef}
              onChange={(e) =>
                onSearchTextChange && onSearchTextChange(e.target.value)
              }
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
