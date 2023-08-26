const getCzDateFormat = (date) => {
  return date.split("-").reverse().join(".");
};

export default getCzDateFormat;
