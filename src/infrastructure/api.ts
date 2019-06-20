import axios from "axios";
import { Service } from "axios-middleware";

const service = new Service(axios);

service.register({
  // handle 401 errors
  onResponseError(error: string) {
    const errorCode = `${error}`.replace(/\D/g, "");
    // @ts-ignore
    if (window.onResponseErrorLogout && +errorCode !== 422) {
      // @ts-ignore
      window.onResponseErrorLogout();
    }
  }
});

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.playlista.co/api"
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
  const playlistData = await axios.get(
    `${API_BASE_URL}/playlists?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return playlistData.data;
};

const getPlaylist = async (id: string, token: string) => {
  const singlePlaylistData = await axios.get(
    `${API_BASE_URL}/playlist?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return singlePlaylistData.data;
};

const analyzePlaylist = async (id: string, token: string) => {
  const analyzedPlaylistData = await axios.get(
    `${API_BASE_URL}/analyze-playlist?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return analyzedPlaylistData.data;
};

const createLink = async (name: string, playlistId: string, token: string) => {
  const link = await axios.post(
    `${API_BASE_URL}/links`,
    {
      id: playlistId,
      name
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: function(status) {
        return status < 500;
      }
    }
  );

  return link.data;
};

const getLinkList = async (token: string) => {
  const linkList = await axios.get(`${API_BASE_URL}/links`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return linkList.data;
};

const getPlaylistFromLink = async (linkId: string) => {
  const urlBase =
    process.env.NODE_ENV === "production"
      ? "https://api.playlista.co"
      : "http://localhost:5000";

  const playlist = await axios.get(`${urlBase}/playlist/${linkId}`, {
    validateStatus: function(status) {
      return status < 500;
    }
  });

  return playlist.data;
};

export {
  getAccount,
  getPlaylists,
  getPlaylist,
  analyzePlaylist,
  createLink,
  getLinkList,
  getPlaylistFromLink
};
