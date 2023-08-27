const getArchiveDate = (date) => {
  return date.slice(0, 7).split("-").reverse().join("-");
};

export default getArchiveDate;
