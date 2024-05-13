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

const sortArchiveMonthsDescending = (arr: ArchiveType[]) => {
  return arr.sort((a: ArchiveType, b: ArchiveType) => {
    const aDate = Date.parse(a.date);
    const bDate = Date.parse(b.date);

    return bDate - aDate;
  });
};

export default sortArchiveMonthsDescending;
