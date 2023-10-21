import "./Search.css";
import cross_button from "../assets/icons/cross_button.svg";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SearchResult from "../components/SearchResult";
import ceska_trebova from "../assets/prices/ceska_trebova.json";
import ostrava from "../assets/prices/ostrava.json";
import plzen from "../assets/prices/plzen.json";
import praha from "../assets/prices/praha.json";
import usti_nad_labem from "../assets/prices/usti_nad_labem.json";
import zlin from "../assets/prices/zlin.json";
import Spinner from "../components/Spinner";

const Search = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const terminal = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.terminal
  );

  // USE STATE -----------------------------------------------------------
  //
  const [json, setJson] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsReady, setSearchResultsReady] = useState(true);

  // DISPLAY PROPER TERMINAL NAME ----------------------------------------
  //
  const displayProperTerminalName = (value) => {
    if (value === "ceska_trebova") {
      return "Česká Třebová";
    } else if (value === "ostrava") {
      return "Ostrava";
    } else if (value === "plzen") {
      return "Plzeň";
    } else if (value === "praha") {
      return "Praha";
    } else if (value === "usti_nad_labem") {
      return "Ústí nad Labem";
    } else if (value === "zlin") {
      return "Zlín";
    } else {
      return value;
    }
  };

  // FILTER BY USER INPUT ------------------------------------------------
  //
  const filterByUserInput = (arrayOfObjects, text) => {
    let result = [];

    if (text.length !== "") {
      for (let i = 0; i < arrayOfObjects.length; i++) {
        const zipcodeString = arrayOfObjects[i].zipcode.toString();

        if (
          arrayOfObjects[i].city.toLowerCase().startsWith(text.toLowerCase()) ||
          zipcodeString.startsWith(text)
        ) {
          result.push(arrayOfObjects[i]);
        } else if (
          arrayOfObjects[i].city.toLowerCase().includes(text.toLowerCase()) ||
          zipcodeString.includes(text)
        ) {
          result.push(arrayOfObjects[i]);
        }
      }
    } else {
      result = [];
    }

    result.sort((a, b) => {
      const aZipcodeString = a.zipcode.toString();
      const bZipcodeString = b.zipcode.toString();

      if (
        a.city.toLowerCase().startsWith(text.toLowerCase()) &&
        !b.city.toLowerCase().startsWith(text.toLowerCase())
      ) {
        return -1;
      } else if (
        b.city.toLowerCase().startsWith(text.toLowerCase()) &&
        !a.city.toLowerCase().startsWith(text.toLowerCase())
      ) {
        return 1;
      } else if (
        a.city.toLowerCase().includes(text.toLowerCase()) &&
        !b.city.toLowerCase().includes(text.toLowerCase())
      ) {
        return -1;
      } else if (
        b.city.toLowerCase().includes(text.toLowerCase()) &&
        !a.city.toLowerCase().includes(text.toLowerCase())
      ) {
        return 1;
      } else if (
        aZipcodeString.startsWith(text) &&
        !bZipcodeString.startsWith(text)
      ) {
        return -1;
      } else if (
        bZipcodeString.startsWith(text) &&
        !aZipcodeString.startsWith(text)
      ) {
        return 1;
      } else if (
        aZipcodeString.includes(text) &&
        !bZipcodeString.includes(text)
      ) {
        return -1;
      } else if (
        bZipcodeString.includes(text) &&
        !aZipcodeString.includes(text)
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    return result;
  };

  // HANDLE CHANGE -------------------------------------------------------
  //
  const handleChange = (event) => {
    setSearchResultsReady(false);
    setInputText(event.target.value);
  };

  // DELETE INPUT TEXT ---------------------------------------------------
  //
  const deleteInputText = () => {
    setInputText("");
    setSearchResults([]);
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    switch (terminal) {
      case "ceska_trebova":
        setJson(ceska_trebova);
        console.log("terminál Česká Třebová");
        break;
      case "ostrava":
        setJson(ostrava);
        console.log("terminál Ostrava");
        break;
      case "plzen":
        setJson(plzen);
        console.log("terminál Plzeň");
        break;
      case "praha":
        setJson(praha);
        console.log("terminál Praha");
        break;
      case "usti_nad_labem":
        setJson(usti_nad_labem);
        console.log("terminál Ústí nad Labem");
        break;
      case "zlin":
        setJson(zlin);
        console.log("terminál Zlín");
        break;

      default:
        setJson(ceska_trebova);
        console.log("spuštěň default");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const inputTextNoDiacritics = inputText
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const result = filterByUserInput(json, inputTextNoDiacritics);
      setSearchResults(result);
      if (inputTextNoDiacritics === "") {
        setSearchResults([]);
      }
      setSearchResultsReady(true);
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [inputText, json]);

  return (
    <section className="search-bar wrapper">
      <div className="terminal text-shadow">
        {"terminál: " + displayProperTerminalName(terminal)}
      </div>
      <div className="search-bar-container">
        <input
          className="search-bar-input"
          placeholder="Obec / PSC"
          autoFocus
          type="text"
          value={inputText}
          onChange={handleChange}
        />
        {inputText !== "" && (
          <img
            className="search-bar-img"
            src={cross_button}
            alt="clear-text-button"
            onClick={deleteInputText}
          />
        )}
      </div>
      {!searchResultsReady ? (
        <div className="spinner-one-line-container">
          <Spinner />
        </div>
      ) : (
        <ul>
          {searchResults.map((result) => (
            <SearchResult
              key={result.objIndex}
              city={result.city}
              zipcode={result.zipcode}
              weightTo27t={result.weightTo27t}
              weightTo34t={result.weightTo34t}
              terminal={terminal}
            />
          ))}
        </ul>
      )}
      {/* <ul>
            {searchResults.map((result) => (
              <SearchResult
                key={result.objIndex}
                city={result.city}
                zipcode={result.zipcode}
                weightTo27t={result.weightTo27t}
                weightTo34t={result.weightTo34t}
                terminal={terminal}
              />
            ))}
      </ul> */}
    </section>
  );
};

export default Search;
