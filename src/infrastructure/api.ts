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

const getPlaylists = async (limit: number, offset: number, token: string) => {
  const playlistData = await axios.get(`${API_BASE_URL}/playlists?limit=${limit}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return playlistData.data;
};

const getPlaylist = async (id: string, token: string) => {
  const singlePlaylistData = await axios.get(`${API_BASE_URL}/playlist?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return singlePlaylistData.data;
}

const analyzePlaylist = async (id: string, token: string) => {
  const analyzedPlaylistData = await axios.get(`${API_BASE_URL}/analyze-playlist?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return analyzedPlaylistData.data;
}

export { getAccount, getPlaylists, getPlaylist, analyzePlaylist };
