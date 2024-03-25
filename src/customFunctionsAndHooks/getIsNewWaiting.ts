import { compareAsc } from "date-fns";

const getIsNewWaiting = (jobDate: string) => {
  const newJobDate = new Date(jobDate);
  const dateForComparison = new Date("2024-04-01");

  const result = compareAsc(newJobDate, dateForComparison);

  return result === 0 || result === 1 ? true : false;
};

export default getIsNewWaiting;
