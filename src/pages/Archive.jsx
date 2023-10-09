import "./Archive.css";
import ArchiveMonth from "../components/ArchiveMonth";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Heading from "../components/Heading";
import BackToTopBtn from "../components/BackToTopBtn";
import Spinner from "../components/Spinner";

const Archive = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //

  return (
    <section className="wrapper">
      <BackToTopBtn />
      {isLoading2 ? (
        <Spinner />
      ) : (
        <>
          {archivedJobs.length === 0 && <Heading text={"Archiv je prázdný"} />}
          {archivedJobs.map((oneMonth) => {
            return <ArchiveMonth key={uuidv4()} oneMonthData={oneMonth} />;
          })}
        </>
      )}
    </section>
  );
};

export default Archive;
