import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { BiSpreadsheet } from "react-icons/bi";
// import { PiMagnifyingGlassBold } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiCharacterRecognitionLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { useDispatch, useSelector } from "react-redux";
import {
  setIsEditingFalseRedux,
  resetJobToAddValuesRedux,
  resetJobToEditValuesRedux,
  resetArchiveMonthSummarySettingsToEditRedux,
} from "../redux/AuthSlice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);
  const isEditing = useAppSelector((state) => state.auth.isEditing);

  // USE STATE -----------------------------------------------------------
  //

  // RESET ---------------------------------------------------------------
  //
  const reset = () => {
    dispatch(setIsEditingFalseRedux());
    dispatch(resetJobToAddValuesRedux());
    dispatch(resetJobToEditValuesRedux());
    dispatch(resetArchiveMonthSummarySettingsToEditRedux());
  };

  // USE EFFECT ----------------------------------------------------------
  //

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {isLoading ||
          (isLoading2 && <div className="navbar-click-blocker"></div>)}
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <BiSpreadsheet />
        </NavLink>

        {/* <NavLink
          to={"/search"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <PiMagnifyingGlassBold />
        </NavLink> */}

        {isEditing ? (
          <NavLink
            to={"/edit-job"}
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
          onClick={reset}
        >
          <RiCharacterRecognitionLine />
        </NavLink>

        <NavLink
          to={"/info-messages"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <HiOutlineChatBubbleLeftEllipsis />
        </NavLink>

        <NavLink
          to={"/settings"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <FiSettings />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
