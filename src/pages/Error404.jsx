import "./Error404.css";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <section>
      <h1>404</h1>
      <br />
      <p>Page does not exist</p>
      <p>
        <Link to={"/"}>Zpět na domovskou stránku</Link>
      </p>
    </section>
  );
};

export default Error404;
