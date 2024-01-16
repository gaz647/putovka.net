type JobType = {
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
  terminal: string;
  timestamp: number;
  waiting: number;
  weight: number;
  weightTo27t: number;
  weightTo34t: number;
  zipcode: string;
};

type ArchiveType = {
  date: string;
  jobs: JobType[];
  userSettings: {
    baseMoney: number;
    eurCzkRate: number;
    percentage: number;
    secondJobBenefit: number;
    waitingBenefitEmployerCzk: number;
    waitingBenefitEur: number;
  };
};

const trimArchiveOver13months = (archive: ArchiveType[]) => {
  if (archive.length > 13) {
    archive.splice(13, archive.length - 13);
  }
  return archive;
};

export default trimArchiveOver13months;
