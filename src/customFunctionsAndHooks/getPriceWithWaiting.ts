const getPriceWithWaiting = (price: number, waiting: number) => {
  if (waiting > 0) {
    if (waiting === 1) {
      return price + 15;
    } else {
      return price + 15 + (waiting - 1) * 30;
    }
  } else {
    return price;
  }
};

export default getPriceWithWaiting;
