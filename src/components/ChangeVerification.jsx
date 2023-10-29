/* eslint-disable react/prop-types */
import "./ChangeVerification.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  logoutRedux,
  resetIsRegisterPending,
  resetIsRegisterReduxSuccess,
  resetIsChangeEmailReduxSuccess,
  resetIsChangePasswordReduxSuccess,
  resetIsDeleteAccountReduxSuccess,
  resetIsLogoutReduxSuccess,
  logoutOnAuthRedux,
  setIsLoading2FalseRedux,
} from "../redux/AuthSlice";

const ChangeVerification = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    dispatch(resetIsRegisterPending());
    dispatch(resetIsRegisterReduxSuccess());
    dispatch(resetIsChangeEmailReduxSuccess());
    dispatch(resetIsChangePasswordReduxSuccess());
    dispatch(resetIsDeleteAccountReduxSuccess());
    dispatch(resetIsLogoutReduxSuccess());
    dispatch(setIsLoading2FalseRedux());

    // Vytvoření intervalu pro aktualizaci odpočítávání
    const interval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Po uplynutí timeoutu provedeme potřebné akce a zrušíme interval

    setTimeout(() => {
      dispatch(logoutRedux());
      dispatch(logoutOnAuthRedux());
      navigate("/login");
      clearInterval(interval); // Zrušení intervalu
    }, 5000);

    // Ukončení intervalu až při odmontování komponenty
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, navigate]);

  return (
    <section className="wrapper">
      <div className="sent-message-container">
        <h3 className="sent-message text-shadow">
          {location.state.firstMessage}
        </h3>

        {location.state.secondMessage && (
          <h3 className="sent-message text-shadow">
            {location.state.secondMessage}
          </h3>
        )}

        <h4 className="sent-message-redirect-info text-shadow">
          Nyní budete přesměrováni na přihlašovací obrazovku.
        </h4>

        <h3 className="text-shadow">{secondsRemaining}</h3>
      </div>
    </section>
  );
};

export default ChangeVerification;
