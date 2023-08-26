import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { BiSpreadsheet } from "react-icons/bi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiCharacterRecognitionLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEditing } from "../redux/AuthSlice";

const Navbar = () => {
  const isEditing = useSelector((state) => state.auth.isEditing);

  const dispatch = useDispatch();

  const setIsEditinFalse = () => {
    dispatch(setEditing(false));
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={setIsEditinFalse}
        >
          <BiSpreadsheet />
        </NavLink>
        <NavLink
          to={"/search"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={setIsEditinFalse}
        >
          <HiOutlineMagnifyingGlass />
        </NavLink>
        {isEditing ? (
          <NavLink
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            <BsPencil />
          </NavLink>
        ) : (
          <NavLink
            to={"/add-job"}
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            <AiOutlinePlusCircle />
          </NavLink>
        )}

        <NavLink
          to={"/archive"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={setIsEditinFalse}
        >
          <RiCharacterRecognitionLine />
        </NavLink>
        <NavLink
          to={"/settings"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={setIsEditinFalse}
        >
          <FiSettings />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
