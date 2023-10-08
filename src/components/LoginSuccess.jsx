import "./LoginSuccess.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoadingFalseRedux } from "../redux/AuthSlice";
import Spinner from "..//components/Spinner";
const LoginSuccess = () => {
  const dispatch = useDispatch();
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

  return <Spinner />;
};

export default LoginSuccess;
