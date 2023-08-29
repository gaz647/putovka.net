import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "..//components/Spinner";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Flip } from "react-toastify";

const SharedLayout = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  const toastVisible = useSelector((state) => state.auth.toast.isVisible);

  const toastMessage = useSelector((state) => state.auth.toast.message);

  const toastStyle = useSelector((state) => state.auth.toast.style);

  useEffect(() => {
    if (toastVisible) {
      toastStyle === "success" ? toast.success(`${toastMessage}`) : null;
    }
  }, [toastVisible, toastMessage, toastStyle]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ToastContainer
            transition={Flip}
            position="top-center"
            autoClose={3000}
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
      )}
    </>
  );
};

export default SharedLayout;
