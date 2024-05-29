import { ArchiveType } from "../types";

const sortArchiveMonthsDescending = (arr: ArchiveType[]) => {
  return arr.sort((a: ArchiveType, b: ArchiveType) => {
    const aDate = Date.parse(a.date);
    const bDate = Date.parse(b.date);

    return bDate - aDate;
  });
};

export default sortArchiveMonthsDescending;
