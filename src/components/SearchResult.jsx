/* eslint-disable react/prop-types */
import "./SearchResult.css";
import { useDispatch } from "react-redux";
import { setJobToAdd } from "../redux/JobsSlice";
import { useNavigate } from "react-router-dom";

const SearchResult = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddClick27 = () => {
    const jobToAdd = {
      city: props.city,
      zipcode: String(props.zipcode),
      terminal: props.terminal,
      weight: 27,
      price: props.weightTo27t,
    };
    dispatch(setJobToAdd(jobToAdd));
    navigate("/add-job");
  };

  const handleAddClick34 = () => {
    const jobToAdd = {
      city: props.city,
      zipcode: String(props.zipcode),
      terminal: props.terminal,
      weight: 34,
      price: props.weightTo34t,
    };
    dispatch(setJobToAdd(jobToAdd));
    navigate("/add-job");
  };

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
            <div
              className="result-second-line-item-upTo27t"
              onClick={handleAddClick27}
            >
              <p className="weight">&lt;27t</p>
              <p className="price">{props.weightTo27t + "€"}</p>
            </div>
          </div>

          <div className="result-second-line-item-right">
            <div
              className="result-second-line-item-upTo34t"
              onClick={handleAddClick34}
            >
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
