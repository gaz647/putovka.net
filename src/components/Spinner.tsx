import DotLoader from "react-spinners/DotLoader";

const Spinner = () => {
  return (
    <DotLoader
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
