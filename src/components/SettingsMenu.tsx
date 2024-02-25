import "./SettingsMenu.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logoutInSettingsRedux } from "../redux/AuthSlice";
import { IoMenu } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";

const SettingsMenu = () => {
  const dispatch = useAppDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const loggedInUserEmail = useAppSelector(
    (state) => state.auth.loggedInUserEmail
  );

  // USE STATE -----------------------------------------------------------
  //
  const [showMenu, setShowMenu] = useState(false);

  const handleBlur = () => {
    setTimeout(() => {
      setShowMenu(false);
    }, 300);
  };

  // HANDLE LOGOUT -------------------------------------------------------
  //
  const handleLogout = () => {
    dispatch(logoutInSettingsRedux());
    // dispatch(logoutOnAuthRedux());
  };

  // USE EFFECT ----------------------------------------------------------
  //
  return (
    <div className="settings-menu" onBlur={handleBlur} tabIndex={0}>
      <button
        className={`settings-menu-icon ${!showMenu && "vis-visible"}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <IoMenu />
      </button>
      <nav className={`settings-menu-content ${!showMenu && "dis-none"}`}>
        <div className=" settings-menu-user-email">{loggedInUserEmail}</div>

        <div className="settings-menu-content-line"></div>

        <div className="settings-menu-anchor" onClick={() => handleLogout()}>
          Odhlásit
        </div>

        <div className="settings-menu-content-line"></div>

        <Link className="settings-menu-anchor" to={"/change-email"}>
          Změnit email
        </Link>

        <div className="settings-menu-content-line"></div>

        <Link className="settings-menu-anchor" to={"/change-password"}>
          Změnit heslo
        </Link>

        <div className="settings-menu-content-line"></div>

        <Link className="settings-menu-anchor" to={"/delete-account"}>
          Smazat účet
        </Link>

        <div className="settings-menu-content-line"></div>

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
      </nav>
    </div>
  );
};

export default SettingsMenu;
