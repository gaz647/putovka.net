/* eslint-disable react/prop-types */
import "./SearchResult.css";
import AddJobButton from "../assets/icons/add-button.svg";

const SearchResult = (props) => {
  const handleAddClick = () => {
    console.log(
      props.city,
      String(props.zipcode),
      props.weightTo27t,
      props.weightTo34t
    );
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
            <div className="result-second-line-item-upTo27t">
              <p className="weight">&lt;27t</p>
              <p className="price">{props.weightTo27t + "€"}</p>
            </div>
          </div>

          <div className="result-second-line-item-middle">
            <div className="add-button">
              <img
                className="add-button-img"
                src={AddJobButton}
                alt="add-job-button"
                onClick={handleAddClick}
              />
            </div>
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
