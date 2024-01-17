const getCzDateFormat = (date: string) => {
  return date.split("-").reverse().join(".");
};

export default getCzDateFormat;
