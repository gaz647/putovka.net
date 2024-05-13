export type JobType = {
  basePlace: string;
  city: string;
  cmr: string;
  date: string;
  day: string;
  id: string;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  timestamp: number;
  waiting: number;
  weight: number;
  zipcode: string;
};

export type ArchiveType = {
  date: string;
  jobs: JobType[];
  eurCzkRate: number;
};

export interface Job {
  basePlace: string;
  city: string;
  cmr: string;
  date: string;
  id: string;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  timestamp: number;
  waiting: number;
  weight: number;
  zipcode: string;
}

export type userSettingsType = {
  baseMoney: number;
  email: string;
  eurCzkRate: number;
  nameFirst: string;
  nameSecond: string;
  numberEm: string;
  numberTrailer: string;
  numberTruck: string;
  percentage: number;
  referenceId: string;
  secondJobBenefit: number;
  terminal: string;
  waitingBenefitEmployerCzk: number;
  waitingBenefitEur: number;
};

export type ArchiveMonthSummaryType = {
  date: string;
  summaryEur: number;
  summaryCzk: number;
  summarySecondJobs: number;
  summaryWaiting: number;

  summaryJobs: number;
  summaryHolidays: number;
  summaryEurCzkRate: number;
  jobs: JobType[];
};
