import SyncLoader from "react-spinners/SyncLoader";

const Spinner2 = () => {
  return (
    <SyncLoader
      color={"#36d7b7"}
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

export default Spinner2;
