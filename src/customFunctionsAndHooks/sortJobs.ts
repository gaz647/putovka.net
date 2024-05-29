import { JobType } from "../types";

const sortJobs = (jobs: JobType[]) => {
  let sortedJobs = jobs.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Porovnání dle data
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    // Pokud jsou data stejná, porovnává klíč isSecondJob
    if (a.isSecondJob && !b.isSecondJob) return -1;
    if (!a.isSecondJob && b.isSecondJob) return 1;

    // Pokud jsou i isSecondJob stejná nebo žádné z objektů nemá isSecondJob: true,
    // porovnává klíč timestamp
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;

    return 0;
  });
  return sortedJobs;
};

export default sortJobs;
