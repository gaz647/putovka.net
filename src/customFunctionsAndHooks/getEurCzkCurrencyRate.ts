import axios from "axios";

const getEurCzkCurrencyRate = async () => {
  const API_KEY = import.meta.env.VITE_REACT_APP_EXCHANGE_RATE_API_KEY;
  const FROM_CURRENCY = "EUR";
  const TO_CURRENCY = "CZK";
  const AMOUNT = 1;
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${FROM_CURRENCY}/${TO_CURRENCY}/${AMOUNT}`
    );
    return response.data.conversion_rate;
  } catch (error: any | null) {
    throw error.message;
  }
};

export default getEurCzkCurrencyRate;
