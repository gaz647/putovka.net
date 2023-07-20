// import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadUserData } from "../redux/AuthSlice";
import { auth } from "../firebase/config";

const Test = () => {
  const dispatch = useDispatch();

  // const testValue = useSelector((state) => state.auth.testValue);

  const handleDispatch = () => {
    const userUid = auth.currentUser.uid;
    dispatch(loadUserData(userUid));
  };

  return (
    <>
      <div
        style={{
          margin: 2 + "rem",
          backgroundColor: "green",
          width: 3 + "rem",
        }}
      >
        {}
      </div>
      <button onClick={() => handleDispatch()} style={{ margin: 2 + "rem" }}>
        Změnit hodnout
      </button>
    </>
  );
};

export default Test;
