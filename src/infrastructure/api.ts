import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const getAccount = async (token: string) => {
  const accountData = await axios.get(`${API_BASE_URL}/account`);

  console.log("account");
  console.log(accountData);

  return accountData;
};

export { getAccount };
