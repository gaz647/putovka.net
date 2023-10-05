import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetToastRedux } from "../redux/AuthSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Flip } from "react-toastify";

const SharedLayout = () => {
  const dispatch = useDispatch();

  // USE SELECTOR
  //
  const toastRedux = useSelector((state) => state.auth.toast);
  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  // USE EFFECT
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
