import "./Archive.css";
import ArchiveMonth from "../components/ArchiveMonth";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Heading from "../components/Heading";

const Archive = () => {
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );

  return (
    <section className="wrapper">
      {archivedJobs.length === 0 ? (
        <Heading text={"Archiv je prázdný"} />
      ) : null}
      {archivedJobs.map((oneMonth) => {
        return <ArchiveMonth key={uuidv4()} oneMonthData={oneMonth} />;
      })}
    </section>
  );
};

export default Archive;
