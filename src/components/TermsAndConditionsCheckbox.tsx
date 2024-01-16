/* eslint-disable react/prop-types */
import "./TermsAndConditionsCheckbox.css";
import { MouseEventHandler } from "react";

const TermsAndConditionsCheckbox = ({
  text,
  linkText,
  linkUrl,
  onCheckboxChecked,
}: {
  text: string;
  linkText: string;
  linkUrl: string;
  onCheckboxChecked: MouseEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="terms-and-conditions-container">
      <input
        type="checkbox"
        className="terms-and-conditions-checkbox"
        onClick={onCheckboxChecked}
      />
      <div className="terms-and-conditions-text">
        {text}{" "}
        <span>
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        </span>
      </div>
    </div>
  );
};

export default TermsAndConditionsCheckbox;
