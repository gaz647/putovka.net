import "./EmailVerificationSent.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";
import { resetIsEmailChangedSuccess } from "../redux/AuthSlice";

const ChangeEmailSent = () => {
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
      dispatch(resetIsEmailChangedSuccess());
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
        <h3 className="sent-message">Váš email byl změněn!</h3>
        <br />
        <h3 className="sent-message">
          Zkontrolujte Vaši emailovou schránku a změnu potvrďte.
        </h3>
        <h4>
          Budete přesměrování na přihlašovací obrazovku za {secondsRemaining}.
        </h4>
      </div>
    </section>
  );
};

export default ChangeEmailSent;
