import "./InfoMessages.css";
import { useAppSelector } from "../redux/hooks";
import { v4 as uuidv4 } from "uuid";
import getCzDateFormat from "../customFunctionsAndHooks/getCzDateFomat";
import Heading from "../components/Heading";
import { InfoMessage } from "../types";

const InfoMessages = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const infoMessages = useAppSelector((state) => state.auth.infoMessages);

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  return (
    <section className="wrapper">
      {infoMessages ? (
        infoMessages.map((oneInfoMessage: InfoMessage) => (
          <div className="info-message-container" key={uuidv4()}>
            <p className="info-message-date">
              {getCzDateFormat(oneInfoMessage.date)}
            </p>
            <br />
            <p className="info-message-title">{oneInfoMessage.title}</p>
            <br />
            <p className="info-message-text">{oneInfoMessage.text}</p>
          </div>
        ))
      ) : (
        <Heading text={"Žádné zprávy"} />
      )}
    </section>
  );
};

export default InfoMessages;
