import "./Register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPasword] = useState("");
  const [registerPassword2, setRegisterPasword2] = useState("");

  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerPassword !== registerPassword2) {
      alert("Zadaná hesla nejsou stejná");
      return;
    } else {
      let registerCredentials = { registerEmail, registerPassword };
      dispatch(register(registerCredentials));
      navigate("/email-verification-pending");
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className="register">
          <form className="register-form" onSubmit={handleRegister}>
            <h1 className="register-form-heading">Registrace</h1>
            <div className="register-form-item">
              <h2>Email</h2>
              <input
                type="email"
                onChange={(e) => setRegisterEmail(e.target.value)}
                value={registerEmail}
              />
            </div>
            <div className="register-form-item">
              <h2>Heslo</h2>
              <input
                type="password"
                placeholder="zadejte heslo"
                onChange={(e) => setRegisterPasword(e.target.value)}
                value={registerPassword}
              />
              <input
                type="password"
                placeholder="zadejte stejné heslo"
                onChange={(e) => setRegisterPasword2(e.target.value)}
                value={registerPassword2}
              />
            </div>
            <div className="register-form-item">
              <button type="submit">Registrovat</button>
            </div>

            <p>
              Již máte účet? <Link to={"/login"}>Přihlašte se.</Link>{" "}
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default Register;
