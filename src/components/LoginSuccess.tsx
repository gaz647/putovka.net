import "./LoginSuccess.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
// import { useDispatch } from "react-redux";
import { setIsLoadingFalseRedux } from "../redux/AuthSlice";
import Spinner from "./Spinner";
const LoginSuccess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    console.log("SpinnerPage - teď se má spustit přesměrování na Dashboard");
    dispatch(setIsLoadingFalseRedux());
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className="full-page-container-center">
      <Spinner />
    </div>
  );
};

export default LoginSuccess;
