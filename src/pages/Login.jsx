import "./Login.css";
import { Link } from "react-router-dom";
import { login } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogIn = () => {
    let loginCredentials = { loginEmail, loginPassword };
    console.log("login SPUŠTĚN V Login.jsx");
    dispatch(login(loginCredentials));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className="login">
          <form className="login-form" onSubmit={handleLogIn}>
            <h1 className="login-form-heading">Přihlášení</h1>
            <div className="login-form-item">
              <h2>Email</h2>
              <input
                type="email"
                onChange={(e) => setLoginEmail(e.target.value)}
                value={loginEmail}
              />
            </div>
            <div className="login-form-item">
              <h2>Heslo</h2>
              <input
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
                value={loginPassword}
              />
            </div>
            <div className="login-form-item">
              <button type="button" onClick={() => handleLogIn()}>
                Přihlásit
              </button>
            </div>

            <p>
              Ještě nemáte účet? <Link to={"/register"}>Zaregistrujte se.</Link>
            </p>

            <p>
              Zapomenuté heslo?{" "}
              <Link to={"/forgotten-password"}>Klikněte zde.</Link>
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default Login;
