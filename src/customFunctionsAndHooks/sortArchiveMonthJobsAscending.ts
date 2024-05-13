type JobType = {
  basePlace: string;
  city: string;
  cmr: string;
  date: string;
  day: string;
  id: string;
  isCustomJob: boolean;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  timestamp: number;
  waiting: number;
  weight: number;
  zipcode: string;
};

type ArchiveType = {
  date: string;
  jobs: JobType[];
  eurCzkRate: number;
};

const sortArchiveMonthJobsAscending = (archivedMonths: ArchiveType[]) => {
  return archivedMonths.map((archivedMonth) => {
    const sortedJobs = archivedMonth.jobs.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Porovnání dle data
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // Pokud jsou data stejná, porovnává klíč isSecondJob
      if (!a.isSecondJob && b.isSecondJob) return -1;
      if (a.isSecondJob && !b.isSecondJob) return 1;

      // Pokud jsou i isSecondJob stejná nebo žádné z objektů nemá isSecondJob: true,
      // porovnává klíč timestamp
      if (a.timestamp < b.timestamp) return -1;
      if (a.timestamp > b.timestamp) return 1;

      return 0;
    });

    return {
      ...archivedMonth,
      jobs: sortedJobs,
    };
  });
};

export default sortArchiveMonthJobsAscending;
