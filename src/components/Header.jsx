/* eslint-disable react/prop-types */
import "./Header.css";

const Header = ({ title, email }) => {
  return (
    <div className="header-container">
      <div className="header">
        <div className="header-title">{title}</div>
        <div className="header-email">{email}</div>
      </div>
    </div>
  );
};

export default Header;
