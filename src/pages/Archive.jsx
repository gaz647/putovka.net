import "./Archive.css";
import ArchiveMonth from "../components/ArchiveMonth";
import { useSelector, useDispatch } from "react-redux";
import {
  resetIsEditArchiveJobReduxSuccess,
  resetIsEditArchiveMonthSummarySettingsReduxSuccess,
  resetIsArchiveDoneJobsAllCasesReduxSuccess,
  setIsLoading2FalseRedux,
} from "../redux/AuthSlice";
import { v4 as uuidv4 } from "uuid";
import Heading from "../components/Heading";
import BackToTopBtn from "../components/BackToTopBtn";
import Spinner from "../components/Spinner";
import { useEffect } from "react";

const Archive = () => {
  const dispatch = useDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isEditArchiveJobReduxSuccess = useSelector(
    (state) => state.auth.isEditArchiveJobReduxSuccess
  );
  const isEditArchiveMonthSummarySettingsReduxSuccess = useSelector(
    (state) => state.auth.isEditArchiveMonthSummarySettingsReduxSuccess
  );
  const isArchiveDoneJobsAllCasesReduxSuccess = useSelector(
    (state) => state.auth.isArchiveDoneJobsAllCasesReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isEditArchiveJobReduxSuccess) {
      dispatch(resetIsEditArchiveJobReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isEditArchiveMonthSummarySettingsReduxSuccess) {
      dispatch(resetIsEditArchiveMonthSummarySettingsReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isArchiveDoneJobsAllCasesReduxSuccess) {
      dispatch(resetIsArchiveDoneJobsAllCasesReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    }
  }, [
    dispatch,
    isArchiveDoneJobsAllCasesReduxSuccess,
    isEditArchiveJobReduxSuccess,
    isEditArchiveMonthSummarySettingsReduxSuccess,
  ]);

  return (
    <section className="wrapper">
      <BackToTopBtn />
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
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
