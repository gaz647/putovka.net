import SyncLoader from "react-spinners/SyncLoader";

const Spinner = () => {
  return (
    <SyncLoader
      color={"#36d7b7"}
      cssOverride={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Spinner;
