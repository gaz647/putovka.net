const getProperTerminalName = (value) => {
  if (value === "ceska_trebova") {
    return "Česká Třebová";
  } else if (value === "ostrava") {
    return "Ostrava";
  } else if (value === "plzen") {
    return "Plzeň";
  } else if (value === "praha") {
    return "Praha";
  } else if (value === "usti_nad_labem") {
    return "Ústí nad Labem";
  } else if (value === "zlin") {
    return "Zlín";
  } else {
    return value;
  }
};

export default getProperTerminalName;
