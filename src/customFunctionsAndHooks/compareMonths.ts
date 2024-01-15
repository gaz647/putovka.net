const compareMonths = (dateA: string, dateB: string) =>
  new Date(dateA).getMonth() === new Date(dateB).getMonth();

export default compareMonths;
