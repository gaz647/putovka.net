// type JobType = {
//   city: string;
//   cmr: string;
//   date: string;
//   day: string;
//   id: string;
//   isCustomJob: boolean;
//   isHoliday: boolean;
//   isSecondJob: boolean;
//   note: string;
//   price: number;
//   terminal: string;
//   timestamp: number;
//   waiting: number;
//   weight: number;
//   weightTo27t: number;
//   weightTo34t: number;
//   zipcode: string;
// };

// type ArchiveType = {
//   date: string | Date;
//   jobs: JobType[];
//   userSettings: {
//     baseMoney: number;
//     eurCzkRate: number;
//     percentage: number;
//     secondJobBenefit: number;
//     waitingBenefitEmployerCzk: number;
//     waitingBenefitEur: number;
//   };
// };

// const sortArchiveMonthsDescending = (arr: ArchiveType[]) => {
//   return arr.sort(
//     (a: ArchiveType, b: ArchiveType) => new Date(b.date) - new Date(a.date)
//   );
// };

// export default sortArchiveMonthsDescending;

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

const sortArchiveMonthsDescending = (arr: ArchiveType[]) => {
  return arr.sort((a: ArchiveType, b: ArchiveType) => {
    const aDate = Date.parse(a.date);
    const bDate = Date.parse(b.date);

    return bDate - aDate;
  });
};

export default sortArchiveMonthsDescending;
