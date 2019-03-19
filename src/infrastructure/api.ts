import axios from "axios";
import { Service } from "axios-middleware";

const service = new Service(axios);

service.register({
  // handle 401 errors
  onResponseError(error: string) {
    console.log(`${error}`);
    // @ts-ignore
    if (window.onResponseErrorLogout) {
      // @ts-ignore
      window.onResponseErrorLogout();
    }
  }
});

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

const getPlaylists = async (token: string) => {
  const playlistData = await axios.get(`${API_BASE_URL}/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return playlistData.data;
};

export { getAccount, getPlaylists };
