/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InputField.css";

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onDateChange,
  onWeightChange,
  onNumberChange,
  onTextChange,
  onCheckboxChange,
}) => {
  const [choosedWeight, setChoosedWeight] = useState(value !== "" ? value : 27);

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
    onNumberChange(Number(value));
  };

  const handleCheckboxChange = (value) => {
    onCheckboxChange(value);
  };

  return (
    <>
      {type === "date" && (
        <div className="input-field-container">
          <label className="input-field-label">
            {value !== "" ? label : null}
          </label>
          <input
            className="input-field-field"
            type="date"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleDateChange(e.target.value)}
          ></input>
        </div>
      )}
      {type === "text" && (
        <div className="input-field-container">
          <label className="input-field-label">
            {value !== "" ? label : null}
          </label>
          <input
            className="input-field-field"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
          ></input>
        </div>
      )}
      {type === "number" && (
        <div className="input-field-container">
          <label className="input-field-label">
            {value !== "" ? label : null}
          </label>
          <input
            className="input-field-field"
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleNumberChange(e.target.value)}
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
          <label className="input-field-label">
            {value !== "" ? label : null}
          </label>
          <input
            className="input-field-checkbox"
            type="checkbox"
            placeholder={placeholder}
            checked={value}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          ></input>
        </div>
      )}
    </>
  );
};

export default InputField;
