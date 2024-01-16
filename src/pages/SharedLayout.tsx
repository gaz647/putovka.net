import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import { resetToastRedux } from "../redux/AuthSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Flip } from "react-toastify";

const SharedLayout = () => {
  const dispatch = useAppDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const toastRedux = useAppSelector((state) => state.auth.toast);
  const resetToastStateRedux = useAppSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (toastRedux.isVisible) {
      console.log("toast SPUŠTĚN");
      toastRedux.style === "success"
        ? toast.success(`${toastRedux.message}`)
        : toastRedux.style === "error"
        ? toast.error(`${toastRedux.message}`)
        : toastRedux.style === "warning"
        ? toast.warning(`${toastRedux.message}`)
        : null;
    }
  }, [toastRedux.isVisible, toastRedux.message, toastRedux.style]);

  useEffect(() => {
    if (resetToastStateRedux) {
      setTimeout(() => {
        dispatch(resetToastRedux());
      }, 500);
    }
  }, [resetToastStateRedux, dispatch]);

  return (
    <>
      <ToastContainer
        transition={Flip}
        position="top-center"
        autoClose={toastRedux.time}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Outlet />
      <Navbar />
    </>
  );
};

export default SharedLayout;
