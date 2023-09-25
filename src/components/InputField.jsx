/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InputField.css";

const InputField = ({
  label,
  type,
  value,
  onDateChange,
  onWeightChange,
  onNumberChange,
  onTextChange,
  onCheckboxChange,
}) => {
  const [choosedWeight, setChoosedWeight] = useState(
    type === "weight" ? (value !== "" ? value : 27) : null
  );
  console.log("choosedWeight", choosedWeight);

  const handleWeightChange = (value) => {
    setChoosedWeight(value);
    onWeightChange(Number(value));
  };

  const handleDateChange = (value) => {
    onDateChange(String(value));
  };

  const handleTextChange = (value) => {
    onTextChange(String(value));
  };

  const handleNumberChange = (value) => {
    if (value < 0) {
      return;
    } else {
      onNumberChange(Number(value));
    }
  };

  const handleCheckboxChange = (value) => {
    onCheckboxChange(value);
  };

  return (
    <>
      {type === "date" && (
        <div className="input-field-container">
          <label className="input-field-label">{label}</label>
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
          <label className="input-field-label">{label}</label>
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
          <label className="input-field-label">{label}</label>
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
      {type === "weight" && (
        <div className="input-field-weight-container">
          <div
            className={`input-field-weight ${
              choosedWeight === 27 ? "input-field-weight-clicked" : ""
            }`}
            onClick={() => handleWeightChange(27)}
          >
            <div className="weight">&lt;27t</div>
          </div>
          <div
            className={`input-field-weight ${
              choosedWeight === 34 ? "input-field-weight-clicked" : ""
            }`}
            onClick={() => handleWeightChange(34)}
          >
            <div className="weight">&lt;34t</div>
          </div>
        </div>
      )}
      {type === "checkbox" && (
        <div className="input-field-checkbox-container">
          <label className="input-field-label">{label}</label>
          <input
            className="input-field-checkbox"
            type="checkbox"
            checked={value}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          ></input>
        </div>
      )}
    </>
  );
};

export default InputField;
