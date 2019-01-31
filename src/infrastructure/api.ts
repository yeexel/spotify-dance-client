import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://spotify-dance-api.herokuapp.com/api"
    : "http://localhost:5000/api";

const getAccount = async (token: string) => {
  const accountData = await axios.get(`${API_BASE_URL}/account`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return accountData.data;
};

export { getAccount };
