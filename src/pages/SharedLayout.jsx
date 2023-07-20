import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "..//components/Spinner";
import { useSelector } from "react-redux";

const SharedLayout = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Outlet />
          <Navbar />
        </>
      )}
    </>
  );
};

export default SharedLayout;
