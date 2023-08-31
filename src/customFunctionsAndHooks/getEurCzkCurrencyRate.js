import axios from "axios";

const API_KEY = "82514d87dee3023eb8c649dc";
const FROM_CURRENCY = "EUR";
const TO_CURRENCY = "CZK";
const AMOUNT = 1;

const getEurCzkCurrencyRate = async () => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${FROM_CURRENCY}/${TO_CURRENCY}/${AMOUNT}`
    );
    return response.data.conversion_rate;
  } catch (error) {
    throw error.message;
  }
};

export default getEurCzkCurrencyRate;
