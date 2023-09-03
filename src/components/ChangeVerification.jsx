/* eslint-disable react/prop-types */
import "./ChangeVerification.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";
import {
  resetIsRegisterSuccess,
  resetIsEmailChangedSuccess,
  resetIsPasswordChangedSuccess,
  resetIsAccountDeleted,
} from "../redux/AuthSlice";

const ChangeVerification = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Nastavení počáteční hodnoty odpočítávání vteřin
  const [secondsRemaining, setSecondsRemaining] = useState(15);

  useEffect(() => {
    // Vytvoření intervalu pro aktualizaci odpočítávání
    const interval = setInterval(() => {
      // Odečteme jednu sekundu od zbývajícího času
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000); // Interval 1000 ms (1 sekunda)

    // Po uplynutí timeoutu provedeme potřebné akce a zrušíme interval
    setTimeout(() => {
      dispatch(logout());
      dispatch(resetIsRegisterSuccess());
      dispatch(resetIsEmailChangedSuccess());
      dispatch(resetIsPasswordChangedSuccess());
      dispatch(resetIsAccountDeleted());
      navigate("/login");
      clearInterval(interval); // Zrušení intervalu
    }, 15000);

    // Ukončení intervalu až při odmontování komponenty
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, navigate]);

  return (
    <section className="wrapper">
      <div className="sent-message-container">
        <h3 className="sent-message">{location.state.firstMessage}</h3>
        <br />
        {location.state.secondMessage !== "" ? (
          <h3 className="sent-message">{location.state.secondMessage}</h3>
        ) : null}

        <h4>Nyní budete přesměrování na přihlašovací obrazovku.</h4>
        <br />
        <h3>{secondsRemaining}</h3>
      </div>
    </section>
  );
};

export default ChangeVerification;
