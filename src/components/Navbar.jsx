import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { BiSpreadsheet } from "react-icons/bi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiCharacterRecognitionLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          <BiSpreadsheet />
        </NavLink>
        <NavLink
          to={"/search"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          <HiOutlineMagnifyingGlass />
        </NavLink>
        <NavLink
          to={"/add-job"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          <AiOutlinePlusCircle />
        </NavLink>
        <NavLink
          to={"/archive"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          <RiCharacterRecognitionLine />
        </NavLink>
        <NavLink
          to={"/settings"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          <FiSettings />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
