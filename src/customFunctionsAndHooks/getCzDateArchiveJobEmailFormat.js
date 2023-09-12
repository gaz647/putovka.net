const getCzDateArchiveJobEmailFormat = (date) => {
  return date.split("-").reverse().join(".").slice(0, 6);
};

export default getCzDateArchiveJobEmailFormat;
