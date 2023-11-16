/* eslint-disable react/prop-types */
import "./SearchResult.css";
import { useDispatch } from "react-redux";
import { setJobToAddRedux } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

const SearchResult = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //

  // HANDLE ADD JOB ------------------------------------------------------
  //
  const handleAddJob = () => {
    const jobToAdd = {
      city: props.city,
      zipcode: String(props.zipcode),
      terminal: props.terminal,
      weightTo27t: props.weightTo27t,
      weightTo34t: props.weightTo34t,
      isCustomJob: false,
    };
    dispatch(setJobToAddRedux(jobToAdd));
    navigate("/add-job");
  };

  // USE EFFECT ----------------------------------------------------------
  //

  return (
    <ul>
      <li className="result-container">
        <div className="result-first-line">
          <div className="city-zipcode-container">
            <div className="city">{props.city}</div>
            <div className="zipcode">{props.zipcode}</div>
          </div>
        </div>

        <div className="result-second-line">
          <div className="result-second-line-item-left">
            <div className="result-second-line-item-upTo27t">
              <p className="weight">&lt;27t</p>
              <p className="price">{props.weightTo27t + "€"}</p>
            </div>
          </div>

          <div
            className="result-second-line-item-middle"
            onClick={handleAddJob}
          >
            <FaPlusCircle className="add-job-btn" />
          </div>

          <div className="result-second-line-item-right">
            <div className="result-second-line-item-upTo34t">
              <p className="weight">&lt;34t</p>
              <p className="price">{props.weightTo34t + "€"}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default SearchResult;
