const getCzDayFromDate = (dateVariable: string) => {
  const dateTransformed = new Date(dateVariable);
  const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
  return daysOfTheWeek[dateTransformed.getDay()];
};

export default getCzDayFromDate;
