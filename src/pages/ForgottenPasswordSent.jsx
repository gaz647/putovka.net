import "./ForgottenPasswordSent.css";

const ForgottenPasswordSent = () => {
  return (
    <section className="wrapper">
      <div className="sent-message-container">
        <h3 className="sent-message">
          Email s odkazem pro obnovu hesla byl úspěšně odeslán!
        </h3>
        <br />
        <h3 className="sent-message">Zkontrolujte Vaši emailovou schránku.</h3>
        <h4>Tuto stránku můžete nyní zavřít</h4>
      </div>
    </section>
  );
};

export default ForgottenPasswordSent;
