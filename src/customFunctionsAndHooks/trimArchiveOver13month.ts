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

const trimArchiveOver13months = (archive: ArchiveType[]) => {
  if (archive.length > 13) {
    archive.splice(13, archive.length - 13);
  }
  return archive;
};

export default trimArchiveOver13months;
