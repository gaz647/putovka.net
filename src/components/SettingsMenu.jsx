import "./SettingsMenu.css";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

const SettingsMenu = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //
  const [showMenu, setShowMenu] = useState(false);

  // USE EFFECT ----------------------------------------------------------
  //
  return (
    <div className="settings-menu">
      <div className={`settings-menu-content ${!showMenu && "vis-hidden"}`}>
        <IoMenu
          className={`settings-menu-icon ${!showMenu && "vis-visible"}`}
          onClick={() => setShowMenu(!showMenu)}
        />
        <div className="settings-menu-content-item">Obchodní podmínky</div>
        <div className="settings-menu-content-line"></div>
        <div className="settings-menu-content-item">
          Souhlas se zpracováním osobních údajů
        </div>
        <div className="settings-menu-content-line"></div>
        <div className="settings-menu-content-item">
          Zásady ochrany osobních údajů
        </div>
        <div className="settings-menu-content-line"></div>
        <div className="settings-menu-content-item">Zpracování cookies</div>
        <div className="settings-menu-content-line"></div>
        <div className="settings-menu-content-item">
          kontakt: info@emtruck.net
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
