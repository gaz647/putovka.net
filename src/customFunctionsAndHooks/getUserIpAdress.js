const getUserIpAdress = async () => {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw error.message || error;
  }
};

export default getUserIpAdress;
