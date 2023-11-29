import "./SettingsMenu.css";
import { IoMenu } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";

const SettingsMenu = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //
  const [showMenu, setShowMenu] = useState(false);

  const handleBlur = () => {
    setTimeout(() => {
      setShowMenu(false);
    }, 300);
  };

  // USE EFFECT ----------------------------------------------------------
  //
  return (
    <div className="settings-menu" onBlur={handleBlur} tabIndex="0">
      <IoMenu
        className={`settings-menu-icon ${!showMenu && "vis-visible"}`}
        onClick={() => setShowMenu(!showMenu)}
      />
      <div className={`settings-menu-content ${!showMenu && "dis-none"}`}>
        <a
          href={"/obchodni-podminky.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="settings-menu-anchor"
        >
          Obchodní podmínky
        </a>

        <div className="settings-menu-content-line"></div>

        <a
          href={"/souhlas-se-zpracovanim-osobnich-udaju.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="settings-menu-anchor"
        >
          Souhlas se zpracováním osobních údajů
        </a>

        <div className="settings-menu-content-line"></div>

        <a
          href={"/zasady-ochrany-osobnich-udaju.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="settings-menu-anchor"
        >
          Zásady ochrany osobních údajů
        </a>

        <div className="settings-menu-content-line"></div>

        <a
          href={"/zpracovani-cookies.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="settings-menu-anchor"
        >
          Zpracování cookies
        </a>

        <div className="settings-menu-content-line"></div>

        <a href="mailto:info@emtruck.net" className="settings-menu-anchor">
          <span className="settings-menu-email-icon">
            <MdOutlineEmail />
          </span>
          info@emtruck.net
        </a>
      </div>
    </div>
  );
};

export default SettingsMenu;
