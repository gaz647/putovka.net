import SyncLoader from "react-spinners/SyncLoader";

const Spinner = () => {
  return (
    <SyncLoader
      color={"#f9fafe"}
      cssOverride={{
        height: "5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
      }}
    />
  );
};

export default Spinner;
